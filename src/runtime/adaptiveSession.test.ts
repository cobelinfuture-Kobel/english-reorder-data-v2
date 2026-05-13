import { buildDrillSessionFromRegistry } from "./sessionBuilder";
import {
  createEmptySentenceMastery,
  getSentenceMasteryScore,
  updateSentenceMastery,
} from "./masteryStore";
import { RegistrySentence } from "./sessionTypes";

function assertDeepEqual<T>(actual: T, expected: T) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, received ${actualJson}`);
  }
}

function assertEqual<T>(actual: T, expected: T) {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
  }
}

const sentences: RegistrySentence[] = [
  {
    id: "sentence-1",
    scenarioId: "personal",
    mode: "LEARN",
    npcPrompt: "Prompt 1",
    expectedAnswer: "Answer 1",
  },
  {
    id: "sentence-2",
    scenarioId: "personal",
    mode: "DRILL",
    npcPrompt: "Prompt 2",
    expectedAnswer: "Answer 2",
  },
  {
    id: "sentence-3",
    scenarioId: "personal",
    mode: "RAPID_RESPONSE",
    npcPrompt: "Prompt 3",
    expectedAnswer: "Answer 3",
  },
];

function testWeightedSessionOrdering() {
  let mastery = createEmptySentenceMastery();
  mastery = updateSentenceMastery(mastery, "sentence-1", true, 0.2);
  mastery = updateSentenceMastery(mastery, "sentence-2", false, -0.2);

  const prompts = buildDrillSessionFromRegistry(sentences, {
    sessionSize: 3,
    strategy: "phase_progression",
    masteryBySentenceId: mastery,
  });

  assertDeepEqual(
    prompts.map((prompt) => prompt.id),
    ["sentence-2", "sentence-3", "sentence-1"],
  );
  assertDeepEqual(
    prompts.map((prompt) => prompt.mode),
    ["LEARN", "DRILL", "RAPID_RESPONSE"],
  );
}

function testMasteryUpdatesAndClamps() {
  let mastery = createEmptySentenceMastery();

  mastery = updateSentenceMastery(mastery, "sentence-1", true, 0.2);
  mastery = updateSentenceMastery(mastery, "sentence-1", true, 0.9);
  mastery = updateSentenceMastery(mastery, "sentence-1", false, -1.4);

  assertEqual(getSentenceMasteryScore(mastery, "sentence-1"), 0);
  assertDeepEqual(mastery["sentence-1"], {
    correct: 2,
    wrong: 1,
    mastery: 0,
  });
}

testWeightedSessionOrdering();
testMasteryUpdatesAndClamps();
