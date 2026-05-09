import personalInfoScenario from "../data/scenarios/personal_info.json";
import personalInfoSentenceRegistry from "../data/registries/personal_info_sentence_registry.json";
import { Chunk, DrillMode, DrillPrompt, Pattern, Scenario } from "../runtime/types";
import { buildDrillSessionFromRegistry } from "../runtime/sessionBuilder";
import { PlayablePrompt, RegistrySentence } from "../runtime/sessionTypes";

export interface MockPromptOption {
  id: string;
  label: string;
  answer: string;
}

export interface MockPrompt {
  id: string;
  mode: "LEARN" | "DRILL" | "RAPID_RESPONSE";
  npcPrompt: string;
  drillPrompt: DrillPrompt;
  choices: MockPromptOption[];
  expectedAnswer: string;
  unlockChunkId?: string;
}

export interface MockSessionState {
  xp: number;
  combo: number;
  unlockedChunkIds: string[];
}

type MockPromptMode = Extract<DrillMode, "LEARN" | "DRILL" | "RAPID_RESPONSE">;
type PersonalInfoSentenceRegistry = {
  registry_id: string;
  scenario_id: string;
  title: string;
  sentences: Array<
    Omit<RegistrySentence, "chunkPool"> & {
      source?: {
        scenario: string;
        patternId: string;
      };
    }
  >;
};

const scenario = personalInfoScenario as Scenario;
const allChunks = scenario.chunks as Chunk[];
const patternsById = new Map<string, Pattern>(
  scenario.patterns.map((pattern) => [pattern.id, pattern as Pattern]),
);
const chunksById = new Map<string, Chunk>(allChunks.map((chunk) => [chunk.id, chunk]));

function requirePattern(patternId: string): Pattern {
  const pattern = patternsById.get(patternId);

  if (!pattern) {
    throw new Error(`Missing mock pattern: ${patternId}`);
  }

  return pattern;
}

function requireChunk(chunkId: string): Chunk {
  const chunk = chunksById.get(chunkId);

  if (!chunk) {
    throw new Error(`Missing mock chunk: ${chunkId}`);
  }

  return chunk;
}

function buildSelectedChunks(sentence: RegistrySentence): Record<string, Chunk> {
  if (!sentence.slotSelections) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(sentence.slotSelections).map(([slotName, chunkId]) => [
      slotName,
      requireChunk(chunkId),
    ]),
  );
}

function buildMockPrompt(
  playablePrompt: PlayablePrompt,
  sentence: RegistrySentence,
): MockPrompt {
  const patternId = sentence.id.replace(/^p\d+_/, "");
  const drillPrompt: DrillPrompt = {
    patternId,
    promptText: playablePrompt.npcPrompt,
    expectedAnswer: playablePrompt.expectedAnswer,
    selectedChunks: buildSelectedChunks(sentence),
  };

  return {
    id: playablePrompt.id,
    mode: playablePrompt.mode as MockPromptMode,
    npcPrompt: playablePrompt.npcPrompt,
    drillPrompt,
    choices: playablePrompt.answerChoices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      answer: choice.answer,
    })),
    expectedAnswer: playablePrompt.expectedAnswer,
    unlockChunkId: playablePrompt.unlockableChunkId,
  };
}

// This file is the transition layer between registry content
// and runtime gameplay UI.
// sentence registry JSON -> sessionBuilder -> DrillConsole-ready prompts
const registryData = personalInfoSentenceRegistry as PersonalInfoSentenceRegistry;
const registrySentences: RegistrySentence[] = registryData.sentences.map((sentence) => {
  const chunkPool = Array.from(
    new Set(Object.values(sentence.slotSelections ?? {})),
  ).map((chunkId) => requireChunk(chunkId));

  const stateChunkIds = ["happy", "hungry", "tired"];

  if (sentence.pattern === "I am {state}." || sentence.pattern === "Are you {state}?") {
    for (const chunkId of stateChunkIds) {
      if (!chunkPool.some((chunk) => chunk.id === chunkId)) {
        chunkPool.push(requireChunk(chunkId));
      }
    }
  }

  return {
    ...sentence,
    chunkPool,
  };
});

const playablePrompts = buildDrillSessionFromRegistry(registrySentences, {
  sessionId: "personal-info-playground",
  sessionTitle: "1-1 Personal Info",
  defaultTimerSeconds: 3,
});

export const initialSessionState: MockSessionState = {
  xp: 0,
  combo: 0,
  unlockedChunkIds: scenario.unlockRules.firstChunkUnlocks,
};

export const sampleChunks: Chunk[] = allChunks;
export const mockPrompts: MockPrompt[] = playablePrompts
  .filter((playablePrompt) => playablePrompt.id !== "p6_be_from_taiwan")
  .map((playablePrompt) => {
    const sourceSentence = registrySentences.find((sentence) => sentence.id === playablePrompt.id);

    if (!sourceSentence) {
      throw new Error(`Missing registry sentence for playable prompt: ${playablePrompt.id}`);
    }

    return buildMockPrompt(playablePrompt, sourceSentence);
  });
export const totalPrompts = mockPrompts.length;
