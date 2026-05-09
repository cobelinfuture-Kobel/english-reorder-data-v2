import personalInfoComboRegistry from "../../data/combo_registry/A1/combo_01_core_self_intro.json";
import { buildBossMissionFromCombo } from "../runtime/sessionBuilder";
import {
  PlayableBossMission,
} from "../runtime/sessionTypes";
import { normalizeOfficialComboRegistry } from "../runtime/registryNormalizer";

const comboDefinition = normalizeOfficialComboRegistry(personalInfoComboRegistry as never);

// This adapter is the transition layer between combo registry content
// and the current BossMission playground UI.
// official combo registry JSON -> registryNormalizer -> sessionBuilder -> PlayableBossMission
export const bossMissionData: PlayableBossMission = buildBossMissionFromCombo(comboDefinition, {
  sessionId: comboDefinition.id,
});
