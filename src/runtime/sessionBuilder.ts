import { Chunk } from "./types";
import {
  PlayableAnswerChoice,
  PlayableBossMission,
  PlayablePrompt,
  PlayableSession,
  RegistryCombo,
  RegistrySentence,
  SessionBuildOptions,
} from "./sessionTypes";

function createAnswerChoices(
  sentence: RegistrySentence,
  allSentences: RegistrySentence[],
): PlayableAnswerChoice[] {
  const providedChoices = sentence.answerChoices ?? [];
  const providedDistractors = sentence.distractorAnswers ?? [];
  const fallbackDistractors = allSentences
    .filter((candidate) => candidate.id !== sentence.id)
    .map((candidate) => candidate.expectedAnswer);

  const orderedChoices = [
    sentence.expectedAnswer,
    ...providedChoices.filter((choice) => choice !== sentence.expectedAnswer),
    ...providedDistractors.filter((choice) => choice !== sentence.expectedAnswer),
    ...fallbackDistractors.filter((choice) => choice !== sentence.expectedAnswer),
  ].filter((choice, index, choices) => choices.indexOf(choice) === index);

  return orderedChoices.slice(0, 4).map((choice, index) => ({
    id: `${sentence.id}-choice-${index + 1}`,
    label: choice,
    answer: choice,
  }));
}

function inferTimerSeconds(
  sentence: RegistrySentence,
  options: SessionBuildOptions,
): number | undefined {
  if (sentence.timerSeconds !== undefined) {
    return sentence.timerSeconds;
  }

  if (sentence.mode === "RAPID_RESPONSE") {
    return options.defaultTimerSeconds ?? 3;
  }

  return undefined;
}

function collectComboChunks(requiredSentences: RegistrySentence[]): Chunk[] {
  const seenChunkIds = new Set<string>();
  const chunks: Chunk[] = [];

  for (const sentence of requiredSentences) {
    for (const chunk of sentence.chunkPool ?? []) {
      if (seenChunkIds.has(chunk.id)) {
        continue;
      }

      seenChunkIds.add(chunk.id);
      chunks.push(chunk);
    }
  }

  return chunks;
}

export function buildDrillSessionFromRegistry(
  sentences: RegistrySentence[],
  options: SessionBuildOptions = {},
): PlayablePrompt[] {
  return sentences.map((sentence) => ({
    id: sentence.id,
    mode: sentence.mode,
    npcPrompt: sentence.npcPrompt,
    expectedAnswer: sentence.expectedAnswer,
    answerChoices: createAnswerChoices(sentence, sentences),
    unlockableChunkId: sentence.unlockableChunkId,
    sourceSentenceId: sentence.id,
    timerSeconds: inferTimerSeconds(sentence, options),
  }));
}

export function buildBossMissionFromCombo(
  combo: RegistryCombo,
  options: SessionBuildOptions = {},
): PlayableBossMission {
  return {
    id: options.sessionId ? `${options.sessionId}-boss` : combo.id,
    title: combo.title,
    description: combo.description,
    requiredSentences: combo.requiredSentences.map((sentence) => sentence.expectedAnswer),
    availableChunks:
      combo.availableChunks.length > 0
        ? combo.availableChunks
        : collectComboChunks(combo.requiredSentences),
    rewards: combo.rewards,
    sourceComboId: combo.id,
  };
}

export function buildPlayableSession(input: {
  sentences: RegistrySentence[];
  combo?: RegistryCombo;
  options?: SessionBuildOptions;
}): PlayableSession {
  const options = input.options ?? {};

  // Intended future flow:
  // sentence_registry.json + combo_registry.json
  // -> sessionBuilder
  // -> DrillConsole / BossMission
  return {
    id: options.sessionId ?? "playable-session",
    title: options.sessionTitle ?? "Registry Session",
    prompts: buildDrillSessionFromRegistry(input.sentences, options),
    bossMission:
      input.combo && options.includeBossMission !== false
        ? buildBossMissionFromCombo(input.combo, options)
        : undefined,
  };
}
