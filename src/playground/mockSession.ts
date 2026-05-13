import personalInfoSentenceRegistry from "../../data/sentence_registry/A1/01_personal_info.json";
import { loadSentenceMastery } from "../runtime/masteryStore";
import { Chunk, DrillMode, DrillPrompt } from "../runtime/types";
import { normalizeOfficialSentenceRegistry } from "../runtime/registryNormalizer";
import { buildDrillSessionFromRegistry } from "../runtime/sessionBuilder";
import { PlayablePrompt, RegistrySentence, SentenceMasteryMap } from "../runtime/sessionTypes";

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
  masteryScore: number;
}

export interface MockSessionState {
  xp: number;
  combo: number;
  unlockedChunkIds: string[];
}

type MockPromptMode = Extract<DrillMode, "LEARN" | "DRILL" | "RAPID_RESPONSE">;
const normalizedSentenceRegistry = normalizeOfficialSentenceRegistry(
  personalInfoSentenceRegistry as never,
);
const allChunks = normalizedSentenceRegistry.chunkCatalog;
const chunksById = new Map<string, Chunk>(allChunks.map((chunk) => [chunk.id, chunk]));

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
    masteryScore: playablePrompt.masteryScore,
  };
}

// This file is the transition layer between official registry content
// and runtime gameplay UI.
// official sentence registry JSON -> registryNormalizer -> sessionBuilder -> DrillConsole-ready prompts
const registrySentences: RegistrySentence[] = normalizedSentenceRegistry.sentences;

export function createMockPrompts(
  masteryBySentenceId: SentenceMasteryMap = loadSentenceMastery(),
  replayCount = 0,
): MockPrompt[] {
  const playablePrompts = buildDrillSessionFromRegistry(registrySentences, {
    sessionId: "personal-info-playground",
    sessionTitle: "1-1 Personal Info",
    defaultTimerSeconds: 3,
    sessionSize: 10,
    replayCount,
    strategy: "phase_progression",
    includeModes: ["LEARN", "DRILL", "RAPID_RESPONSE"],
    masteryBySentenceId,
  });

  return playablePrompts.map((playablePrompt) => {
    const sourceSentence = registrySentences.find((sentence) => sentence.id === playablePrompt.id);

    if (!sourceSentence) {
      throw new Error(`Missing registry sentence for playable prompt: ${playablePrompt.id}`);
    }

    return buildMockPrompt(playablePrompt, sourceSentence);
  });
}

export const initialSessionState: MockSessionState = {
  xp: 0,
  combo: 0,
  unlockedChunkIds: [],
};

export const sampleChunks: Chunk[] = allChunks;
export const mockPrompts: MockPrompt[] = createMockPrompts();
export const totalPrompts = mockPrompts.length;
