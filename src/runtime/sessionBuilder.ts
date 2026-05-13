import { Chunk } from "./types";
import { getSentenceMasteryScore } from "./masteryStore";
import {
  PlayableAnswerChoice,
  PlayableBossChunk,
  PlayableBossMission,
  PlayablePrompt,
  PlayableSession,
  RegistryCombo,
  RegistrySentence,
  SessionBuildOptions,
} from "./sessionTypes";

type DrillPlayableMode = Extract<RegistrySentence["mode"], "LEARN" | "DRILL" | "RAPID_RESPONSE">;

function isQuestionPrompt(sentence: RegistrySentence): boolean {
  return (
    sentence.npcPrompt.trim().endsWith("?") ||
    sentence.expectedAnswer.trim().endsWith("?") ||
    sentence.communicativeFunction?.startsWith("ask_") === true ||
    sentence.grammarTags?.includes("yes_no_question") === true ||
    sentence.grammarTags?.includes("wh_question") === true ||
    sentence.drillTags?.some((tag) => tag.includes("question")) === true
  );
}

function allowsQuestionAnswerChoices(sentence: RegistrySentence): boolean {
  return sentence.grammarTags?.includes("question_form") === true;
}

function isCompatibleResponseQuestion(sentence: RegistrySentence): boolean {
  return sentence.interactionType === "be_yes_no_response" ||
    (isQuestionPrompt(sentence) && Boolean(sentence.responseAnswers));
}

function shouldKeepAnswerChoice(sentence: RegistrySentence, choice: string): boolean {
  if (choice === sentence.npcPrompt) {
    return false;
  }

  if (!allowsQuestionAnswerChoices(sentence) && choice.trim().endsWith("?")) {
    return false;
  }

  return true;
}

function createAnswerChoices(
  sentence: RegistrySentence,
  allSentences: RegistrySentence[],
  effectiveExpectedAnswer: string,
  effectiveMode: DrillPlayableMode,
  rapidResponseVariant: "yes" | "no" | null,
): PlayableAnswerChoice[] {
  if (effectiveMode === "RAPID_RESPONSE" && rapidResponseVariant && sentence.responseAnswers) {
    const preferredAnswer =
      rapidResponseVariant === "yes"
        ? sentence.responseAnswers.yes ?? effectiveExpectedAnswer
        : sentence.responseAnswers.no ?? effectiveExpectedAnswer;
    const alternateAnswer =
      rapidResponseVariant === "yes"
        ? sentence.responseAnswers.no ?? "No, I am not."
        : sentence.responseAnswers.yes ?? "Yes, I am.";

    return [preferredAnswer, alternateAnswer]
      .filter((choice, index, choices) => choices.indexOf(choice) === index)
      .filter((choice) => shouldKeepAnswerChoice(sentence, choice))
      .slice(0, 4)
      .map((choice, index) => ({
        id: `${sentence.id}-choice-${index + 1}`,
        label: choice,
        answer: choice,
      }));
  }

  const providedChoices = sentence.answerChoices ?? [];
  const providedDistractors = sentence.distractorAnswers ?? [];
  const fallbackDistractors = allSentences
    .filter((candidate) => candidate.id !== sentence.id)
    .map((candidate) => candidate.expectedAnswer);

  const orderedChoices = [
    effectiveExpectedAnswer,
    ...providedChoices.filter((choice) => choice !== effectiveExpectedAnswer),
    ...providedDistractors.filter((choice) => choice !== effectiveExpectedAnswer),
    ...fallbackDistractors.filter((choice) => choice !== effectiveExpectedAnswer),
  ]
    .filter((choice, index, choices) => choices.indexOf(choice) === index)
    .filter((choice) => shouldKeepAnswerChoice(sentence, choice));

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

function getModeCounts(totalSentences: number): Record<DrillPlayableMode, number> {
  const learnCount = Math.max(1, Math.ceil(totalSentences * 0.3));
  const rapidResponseCount = Math.max(1, Math.ceil(totalSentences * 0.3));
  const drillCount = Math.max(0, totalSentences - learnCount - rapidResponseCount);

  if (drillCount >= 0) {
    return {
      LEARN: learnCount,
      DRILL: drillCount,
      RAPID_RESPONSE: rapidResponseCount,
    };
  }

  return {
    LEARN: Math.max(1, totalSentences - 2),
    DRILL: 1,
    RAPID_RESPONSE: 1,
  };
}

function selectSessionSentences(
  sentences: RegistrySentence[],
  options: SessionBuildOptions,
): RegistrySentence[] {
  const filteredSentences =
    options.includeModes && options.includeModes.length > 0
      ? sentences.filter((sentence) => options.includeModes?.includes(sentence.mode as DrillPlayableMode))
      : sentences;

  const prioritizedSentences = filteredSentences
    .map((sentence, index) => ({
      sentence,
      index,
      masteryScore: getSentenceMasteryScore(options.masteryBySentenceId ?? {}, sentence.id),
    }))
    .sort((left, right) => {
      if (left.masteryScore !== right.masteryScore) {
        return left.masteryScore - right.masteryScore;
      }

      return left.index - right.index;
    })
    .map(({ sentence }) => sentence);
  const sessionSize = options.sessionSize ?? prioritizedSentences.length;

  return prioritizedSentences.slice(0, Math.min(sessionSize, prioritizedSentences.length));
}

function getGeneratedMode(index: number, total: number): DrillPlayableMode {
  const counts = getModeCounts(total);

  if (index < counts.LEARN) {
    return "LEARN";
  }

  if (index < counts.LEARN + counts.DRILL) {
    return "DRILL";
  }

  return "RAPID_RESPONSE";
}

function getEffectiveExpectedAnswer(
  sentence: RegistrySentence,
  effectiveMode: DrillPlayableMode,
  rapidResponseVariant: "yes" | "no" | null,
): string {
  if (isCompatibleResponseQuestion(sentence) && sentence.responseAnswers) {
    if (effectiveMode === "RAPID_RESPONSE" && rapidResponseVariant) {
      return rapidResponseVariant === "yes"
        ? sentence.responseAnswers.yes ?? sentence.expectedAnswer
        : sentence.responseAnswers.no ?? sentence.expectedAnswer;
    }

    return sentence.responseAnswers.yes ?? sentence.expectedAnswer;
  }

  if (effectiveMode === "RAPID_RESPONSE" && rapidResponseVariant && sentence.responseAnswers) {
    return rapidResponseVariant === "yes"
      ? sentence.responseAnswers.yes ?? sentence.expectedAnswer
      : sentence.responseAnswers.no ?? sentence.expectedAnswer;
  }

  return sentence.expectedAnswer;
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
  const selectedSentences = selectSessionSentences(sentences, options);
  const rapidResponseQuestionIndex = selectedSentences
    .map((sentence, index) => ({ sentence, index }))
    .filter(({ sentence }) => sentence.responseAnswers)
    .map(({ index }) => index);

  let rapidResponseVariantCounter = 0;

  return selectedSentences.map((sentence, index) => {
    const effectiveMode =
      options.strategy === "phase_progression" || !options.strategy
        ? getGeneratedMode(index, selectedSentences.length)
        : (sentence.mode as DrillPlayableMode);
    const rapidResponseVariant =
      effectiveMode === "RAPID_RESPONSE" && sentence.responseAnswers
        ? (rapidResponseVariantCounter++ % 2 === 0 ? "yes" : "no")
        : null;
    const effectiveExpectedAnswer = getEffectiveExpectedAnswer(
      sentence,
      effectiveMode,
      rapidResponseVariant,
    );

    return {
      id: sentence.id,
      mode: effectiveMode,
      npcPrompt: sentence.npcPrompt,
      expectedAnswer: effectiveExpectedAnswer,
      answerChoices: createAnswerChoices(
        sentence,
        selectedSentences,
        effectiveExpectedAnswer,
        effectiveMode,
        rapidResponseVariant,
      ),
      unlockableChunkId: sentence.unlockableChunkId,
      sourceSentenceId: sentence.id,
      timerSeconds:
        effectiveMode === "RAPID_RESPONSE" ? inferTimerSeconds(sentence, options) : undefined,
      masteryScore: getSentenceMasteryScore(options.masteryBySentenceId ?? {}, sentence.id),
    };
  });
}

export function buildBossMissionFromCombo(
  combo: RegistryCombo,
  options: SessionBuildOptions = {},
): PlayableBossMission {
  return {
    id: options.sessionId ? `${options.sessionId}-boss` : combo.id,
    title: combo.title,
    description: combo.description,
    templates: combo.templates ?? [],
    requiredSentences: combo.requiredSentences.map((sentence) => sentence.expectedAnswer),
    availableChunks:
      combo.availableChunks.length > 0
        ? combo.availableChunks
        : collectComboChunks(combo.requiredSentences),
    rewards: combo.rewards,
    sourceComboId: combo.id,
  } as PlayableBossMission;
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
