import personalInfoComboRegistry from "../data/registries/personal_info_combo_registry.json";
import { buildBossMissionFromCombo } from "../runtime/sessionBuilder";
import {
  PlayableBossChunk,
  PlayableBossMission,
  PlayableBossTemplate,
  RegistryCombo,
  RegistrySentence,
} from "../runtime/sessionTypes";

type BossComboRegistry = {
  registry_id: string;
  scenario_id: string;
  title: string;
  description: string;
  templates: PlayableBossTemplate[];
  required_sentences: RegistrySentence[];
  available_chunks: PlayableBossChunk[];
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
  templates: comboRegistry.templates,
  rewards: comboRegistry.rewards,
};

// This adapter is the transition layer between combo registry content
// and the current BossMission playground UI.
// combo registry JSON -> sessionBuilder -> PlayableBossMission
export const bossMissionData: PlayableBossMission = buildBossMissionFromCombo(comboDefinition, {
  sessionId: comboRegistry.scenario_id,
});
