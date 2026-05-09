import personalInfoScenario from "../data/scenarios/personal_info.json";
import { buildPrompt } from "../runtime/sentenceEngine";
import { Chunk, DrillPrompt, Pattern, Scenario } from "../runtime/types";

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

const scenario = personalInfoScenario as Scenario;
const allChunks = scenario.chunks as Chunk[];
const patternsById = new Map<string, Pattern>(
  scenario.patterns.map((pattern) => [pattern.id, pattern as Pattern]),
);

function requirePattern(patternId: string): Pattern {
  const pattern = patternsById.get(patternId);

  if (!pattern) {
    throw new Error(`Missing mock pattern: ${patternId}`);
  }

  return pattern;
}

function selectChunks(chunkIds: string[]): Chunk[] {
  return allChunks.filter((chunk) => chunkIds.includes(chunk.id));
}

function buildMockPrompt(
  id: string,
  mode: "LEARN" | "DRILL" | "RAPID_RESPONSE",
  patternId: string,
  chunkIds: string[],
  choices: MockPromptOption[],
  unlockChunkId?: string,
): MockPrompt {
  const pattern = requirePattern(patternId);
  const chunks = selectChunks(chunkIds);
  const drillPrompt = buildPrompt(pattern, chunks);

  return {
    id,
    mode,
    npcPrompt: pattern.prompt,
    drillPrompt,
    choices,
    expectedAnswer: drillPrompt.expectedAnswer,
    unlockChunkId,
  };
}

export const initialSessionState: MockSessionState = {
  xp: 0,
  combo: 0,
  unlockedChunkIds: scenario.unlockRules.firstChunkUnlocks,
};

export const sampleChunks: Chunk[] = allChunks;
export const totalPrompts = 5;

export const mockPrompts: MockPrompt[] = [
  buildMockPrompt(
    "p1",
    "LEARN",
    "be_state",
    ["happy"],
    [
      { id: "p1-a", label: "I am happy.", answer: "I am happy." },
      { id: "p1-b", label: "I am hungry.", answer: "I am hungry." },
      { id: "p1-c", label: "Yes, I am.", answer: "Yes, I am." },
    ],
    "happy",
  ),
  buildMockPrompt(
    "p2",
    "DRILL",
    "be_state",
    ["hungry"],
    [
      { id: "p2-a", label: "I am tired.", answer: "I am tired." },
      { id: "p2-b", label: "I am hungry.", answer: "I am hungry." },
      { id: "p2-c", label: "No, I am not.", answer: "No, I am not." },
    ],
    "hungry",
  ),
  buildMockPrompt(
    "p3",
    "DRILL",
    "question_are_you_state",
    ["tired"],
    [
      { id: "p3-a", label: "Are you tired?", answer: "Are you tired?" },
      { id: "p3-b", label: "Are you happy?", answer: "Are you happy?" },
      { id: "p3-c", label: "I am tired.", answer: "I am tired." },
    ],
    "tired",
  ),
  {
    id: "p4",
    mode: "RAPID_RESPONSE",
    npcPrompt: "Answer the question: Are you hungry?",
    drillPrompt: {
      patternId: "short_answer_yes",
      promptText: "Answer yes.",
      expectedAnswer: "Yes, I am.",
      selectedChunks: {},
    },
    choices: [
      { id: "p4-a", label: "Yes, I am.", answer: "Yes, I am." },
      { id: "p4-b", label: "No, I am not.", answer: "No, I am not." },
      { id: "p4-c", label: "I am hungry.", answer: "I am hungry." },
    ],
    expectedAnswer: "Yes, I am.",
  },
  {
    id: "p5",
    mode: "RAPID_RESPONSE",
    npcPrompt: "Answer the question: Are you tired?",
    drillPrompt: {
      patternId: "short_answer_no",
      promptText: "Answer no.",
      expectedAnswer: "No, I am not.",
      selectedChunks: {},
    },
    choices: [
      { id: "p5-a", label: "Yes, I am.", answer: "Yes, I am." },
      { id: "p5-b", label: "No, I am not.", answer: "No, I am not." },
      { id: "p5-c", label: "Are you tired?", answer: "Are you tired?" },
    ],
    expectedAnswer: "No, I am not.",
  },
];
