import { Chunk, DrillMode, Pattern } from "./types";

export interface CurriculumScenario {
  id: string;
  order: number;
  title: string;
  status: "ready" | "planned";
  sentence_registry_path: string;
  combo_registry_ids: string[];
}

export interface CurriculumIndex {
  level_id: string;
  title: string;
  scenarios: CurriculumScenario[];
}

export interface RegistrySentence {
  id: string;
  scenarioId: string;
  mode: DrillMode;
  npcPrompt: string;
  expectedAnswer: string;
  pattern?: string;
  grammarTags?: string[];
  answerChoices?: string[];
  distractorAnswers?: string[];
  responseAnswers?: {
    yes?: string;
    no?: string;
  };
  unlockableChunkId?: string;
  timerSeconds?: number;
  chunkPool?: Chunk[];
  slotSelections?: Record<string, string>;
}

export interface SentenceMasteryEntry {
  correct: number;
  wrong: number;
  mastery: number;
}

export type SentenceMasteryMap = Record<string, SentenceMasteryEntry>;

export interface RegistryCombo {
  id: string;
  title: string;
  description: string;
  requiredSentences: RegistrySentence[];
  availableChunks: Chunk[];
  templates?: PlayableBossTemplate[];
  rewards: {
    xp: number;
    unlockedChunkReward: string;
  };
}

export interface PlayableAnswerChoice {
  id: string;
  label: string;
  answer: string;
}

export interface PlayablePrompt {
  id: string;
  mode: DrillMode;
  npcPrompt: string;
  expectedAnswer: string;
  answerChoices: PlayableAnswerChoice[];
  unlockableChunkId?: string;
  sourceSentenceId: string;
  timerSeconds?: number;
  masteryScore: number;
}

export interface PlayableBossChunk extends Chunk {
  displayText?: string;
}

export interface PlayableBossTemplate {
  id: string;
  pattern: Pattern;
}

export interface PlayableBossMission {
  id: string;
  title: string;
  description: string;
  templates: PlayableBossTemplate[];
  requiredSentences: string[];
  availableChunks: PlayableBossChunk[];
  rewards: {
    xp: number;
    unlockedChunkReward: string;
  };
  sourceComboId: string;
}

export interface PlayableSession {
  id: string;
  title: string;
  prompts: PlayablePrompt[];
  bossMission?: PlayableBossMission;
}

export interface SessionBuildOptions {
  sessionId?: string;
  sessionTitle?: string;
  defaultTimerSeconds?: number;
  includeBossMission?: boolean;
  sessionSize?: number;
  strategy?: "phase_progression";
  includeModes?: Array<Extract<DrillMode, "LEARN" | "DRILL" | "RAPID_RESPONSE">>;
  masteryBySentenceId?: SentenceMasteryMap;
}
