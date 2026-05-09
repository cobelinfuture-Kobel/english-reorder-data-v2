import personalInfoComboRegistry from "../data/registries/personal_info_combo_registry.json";
import { buildBossMissionFromCombo } from "../runtime/sessionBuilder";
import { RegistryCombo, RegistrySentence } from "../runtime/sessionTypes";
import { Chunk, Pattern } from "../runtime/types";

export interface BossChunk extends Chunk {
  displayText: string;
}

export interface BossMissionTemplate {
  id: string;
  pattern: Pattern;
}

export interface BossMissionDefinition {
  id: string;
  title: string;
  description: string;
  templates: BossMissionTemplate[];
  availableChunks: BossChunk[];
  expectedSolutions: string[];
  xpReward: number;
  unlockedChunkReward: string;
  sourceComboId: string;
}

type BossComboRegistry = {
  registry_id: string;
  scenario_id: string;
  title: string;
  description: string;
  templates: BossMissionTemplate[];
  required_sentences: RegistrySentence[];
  available_chunks: BossChunk[];
  rewards: {
    xp: number;
    unlockedChunkReward: string;
  };
};

const comboRegistry = personalInfoComboRegistry as unknown as BossComboRegistry;
const comboDefinition: RegistryCombo = {
  id: comboRegistry.registry_id,
  title: comboRegistry.title,
  description: comboRegistry.description,
  requiredSentences: comboRegistry.required_sentences,
  availableChunks: comboRegistry.available_chunks,
  rewards: comboRegistry.rewards,
};

const playableBossMission = buildBossMissionFromCombo(comboDefinition, {
  sessionId: comboRegistry.scenario_id,
});

// This adapter is the transition layer between combo registry content
// and the current BossMission playground UI.
// combo registry JSON -> sessionBuilder -> BossMission-ready data
export const bossMissionData: BossMissionDefinition = {
  id: playableBossMission.id,
  title: playableBossMission.title,
  description: playableBossMission.description,
  templates: comboRegistry.templates,
  availableChunks: comboRegistry.available_chunks,
  expectedSolutions: playableBossMission.requiredSentences,
  xpReward: playableBossMission.rewards.xp,
  unlockedChunkReward: playableBossMission.rewards.unlockedChunkReward,
  sourceComboId: playableBossMission.sourceComboId,
};
