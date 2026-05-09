export type SlotType = "state" | "age" | "place" | "identity" | "family_member" | "possessive";

export type DrillMode = "LEARN" | "DRILL" | "RAPID_RESPONSE" | "BOSS" | "MASTERED";

export interface Slot {
  name: string;
  type: SlotType;
  required: boolean;
  prompt?: string;
}

export interface Chunk {
  id: string;
  text: string;
  slotType: SlotType;
  unlockedByDefault?: boolean;
  scenarioSource: string;
}

export interface Pattern {
  id: string;
  scenarioId: string;
  prompt: string;
  template: string;
  slots: Slot[];
  allowedChunkIds: string[];
  distractorChunkIds?: string[];
  expectedAnswers?: string[];
  hint: string;
}

export interface DrillPrompt {
  patternId: string;
  promptText: string;
  expectedAnswer: string;
  selectedChunks: Record<string, Chunk>;
}

export interface ValidationResult {
  isCorrect: boolean;
  errorType: "NONE" | "EMPTY" | "MISMATCH" | "SLOT_MISMATCH";
  correctedAnswer: string;
  hint: string;
  masteryDelta: number;
}

export interface PlayerProgress {
  scenarioId: string;
  currentMode: DrillMode;
  correctStreak: number;
  incorrectStreak: number;
  totalCorrect: number;
  totalAttempts: number;
}

export interface ChunkInventoryItem {
  chunkId: string;
  unlocked: boolean;
  uses: number;
  correctUses: number;
  mastery: number;
}

export interface Scenario {
  id: string;
  title: string;
  patterns: Pattern[];
  chunks: Chunk[];
  unlockRules: {
    firstChunkUnlocks: string[];
    modeProgression: Record<DrillMode, number>;
  };
  masteryThresholds: {
    learnToDrill: number;
    drillToRapidResponse: number;
    rapidResponseToBoss: number;
    bossToMastered: number;
  };
}
