import personalInfoScenario from "../data/scenarios/personal_info.json";
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
// registry-like sentence data -> sessionBuilder -> DrillConsole-ready prompts
const registrySentences: RegistrySentence[] = [
  {
    id: "p1_be_state_happy",
    scenarioId: "1_1_personal_info",
    mode: "LEARN",
    npcPrompt: "How are you?",
    pattern: "I am {state}.",
    expectedAnswer: "I am happy.",
    answerChoices: ["I am happy.", "I am hungry.", "Yes, I am."],
    unlockableChunkId: "happy",
    grammarTags: ["be_verb", "present_simple", "state_expression"],
    chunkPool: [requireChunk("happy"), requireChunk("hungry"), requireChunk("tired")],
    slotSelections: { state: "happy" },
  },
  {
    id: "p2_be_state_hungry",
    scenarioId: "1_1_personal_info",
    mode: "DRILL",
    npcPrompt: "How are you?",
    pattern: "I am {state}.",
    expectedAnswer: "I am hungry.",
    answerChoices: ["I am hungry.", "I am tired.", "No, I am not."],
    unlockableChunkId: "hungry",
    grammarTags: ["be_verb", "present_simple", "state_expression"],
    chunkPool: [requireChunk("happy"), requireChunk("hungry"), requireChunk("tired")],
    slotSelections: { state: "hungry" },
  },
  {
    id: "p3_are_you_hungry",
    scenarioId: "1_1_personal_info",
    mode: "DRILL",
    npcPrompt: "Answer the question: Are you hungry?",
    pattern: "Are you {state}?",
    expectedAnswer: "Are you hungry?",
    answerChoices: ["Are you hungry?", "Are you happy?", "I am hungry."],
    grammarTags: ["question_form", "be_verb", "state_expression"],
    chunkPool: [requireChunk("happy"), requireChunk("hungry"), requireChunk("tired")],
    slotSelections: { state: "hungry" },
  },
  {
    id: "p4_short_answer_yes",
    scenarioId: "1_1_personal_info",
    mode: "RAPID_RESPONSE",
    npcPrompt: "Answer the question: Are you hungry?",
    pattern: "Yes, I am.",
    expectedAnswer: "Yes, I am.",
    answerChoices: ["Yes, I am.", "No, I am not.", "I am hungry."],
    grammarTags: ["short_answer", "be_verb", "affirmative_response"],
    chunkPool: [requireChunk("hungry")],
    timerSeconds: 3,
  },
  {
    id: "p5_short_answer_no",
    scenarioId: "1_1_personal_info",
    mode: "RAPID_RESPONSE",
    npcPrompt: "Answer the question: Are you tired?",
    pattern: "No, I am not.",
    expectedAnswer: "No, I am not.",
    answerChoices: ["No, I am not.", "Yes, I am.", "Are you tired?"],
    grammarTags: ["short_answer", "be_verb", "negative_response"],
    chunkPool: [requireChunk("tired")],
    timerSeconds: 3,
  },
  {
    id: "p6_be_from_taiwan",
    scenarioId: "1_1_personal_info",
    mode: "DRILL",
    npcPrompt: "Where are you from?",
    pattern: "I am from {place}.",
    expectedAnswer: "I am from Taiwan.",
    answerChoices: ["I am from Taiwan.", "I am hungry.", "No, I am not."],
    unlockableChunkId: "taiwan",
    grammarTags: ["be_verb", "present_simple", "origin_expression"],
    chunkPool: [requireChunk("taiwan"), requireChunk("from_taiwan")],
    slotSelections: { place: "taiwan" },
  },
];

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
