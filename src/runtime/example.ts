import { getUnlockedChunks, createInitialInventory, recordChunkUse } from "./chunkInventory";
import { advanceDrillState, createDrillPrompt } from "./drillEngine";
import { validateSlotAnswer } from "./validationEngine";
import { Chunk, Pattern, PlayerProgress } from "./types";

const chunks: Chunk[] = [
  { id: "hungry", text: "hungry", slotType: "state", unlockedByDefault: true, scenarioSource: "1_1_personal_info" },
  { id: "happy", text: "happy", slotType: "state", unlockedByDefault: true, scenarioSource: "1_1_personal_info" },
];

const pattern: Pattern = {
  id: "be_state",
  scenarioId: "1_1_personal_info",
  prompt: "How are you?",
  template: "I am {state}.",
  slots: [{ name: "state", type: "state", required: true }],
  allowedChunkIds: ["hungry", "happy"],
  hint: "Use I am plus a feeling word.",
};

let progress: PlayerProgress = {
  scenarioId: "1_1_personal_info",
  currentMode: "LEARN",
  correctStreak: 0,
  incorrectStreak: 0,
  totalCorrect: 0,
  totalAttempts: 0,
};

let inventory = createInitialInventory(chunks);
const prompt = createDrillPrompt(pattern, chunks);
const result = validateSlotAnswer(pattern, prompt.selectedChunks, "I am hungry.");

inventory = recordChunkUse(inventory, "hungry", result.isCorrect);
progress = advanceDrillState(progress, result);

console.log(prompt.expectedAnswer);
console.log(getUnlockedChunks(inventory));
console.log(progress.currentMode);
