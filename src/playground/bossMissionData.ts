import { Chunk, Pattern } from "../runtime/types";

export interface BossChunk extends Chunk {
  displayText: string;
}

export interface BossMissionTemplate {
  id: string;
  pattern: Pattern;
}

export interface BossMissionDefinition {
  title: string;
  description: string;
  templates: BossMissionTemplate[];
  availableChunks: BossChunk[];
  expectedSolutions: string[];
  xpReward: number;
  unlockedChunkReward: string;
}

const scenarioId = "1_1_personal_info_boss";

export const bossMissionData: BossMissionDefinition = {
  title: "Introduce Yourself to the Guild",
  description:
    "Forge a short guild introduction by completing your identity, age, and origin sentences.",
  templates: [
    {
      id: "identity_intro",
      pattern: {
        id: "boss_identity",
        scenarioId,
        prompt: "Tell the guild who you are.",
        template: "I am {identity}.",
        slots: [{ name: "identity", type: "identity", required: true }],
        allowedChunkIds: ["leo", "student"],
        hint: "Use a name or identity chunk.",
      },
    },
    {
      id: "age_intro",
      pattern: {
        id: "boss_age",
        scenarioId,
        prompt: "Tell the guild your age.",
        template: "I am {age}.",
        slots: [{ name: "age", type: "age", required: true }],
        allowedChunkIds: ["seven_years_old"],
        hint: "Use your age chunk.",
      },
    },
    {
      id: "place_intro",
      pattern: {
        id: "boss_place",
        scenarioId,
        prompt: "Tell the guild where you are from.",
        template: "I am from {place}.",
        slots: [{ name: "place", type: "place", required: true }],
        allowedChunkIds: ["taiwan", "japan"],
        hint: "Use a place chunk after from.",
      },
    },
  ],
  availableChunks: [
    {
      id: "leo",
      text: "Leo",
      displayText: "Leo",
      slotType: "identity",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "student",
      text: "a student",
      displayText: "a student",
      slotType: "identity",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "seven_years_old",
      text: "seven years old",
      displayText: "seven years old",
      slotType: "age",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "taiwan",
      text: "Taiwan",
      displayText: "from Taiwan",
      slotType: "place",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "japan",
      text: "Japan",
      displayText: "from Japan",
      slotType: "place",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "happy",
      text: "happy",
      displayText: "happy",
      slotType: "state",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
    {
      id: "hungry",
      text: "hungry",
      displayText: "hungry",
      slotType: "state",
      scenarioSource: scenarioId,
      unlockedByDefault: true,
    },
  ],
  expectedSolutions: [
    "I am Leo.",
    "I am seven years old.",
    "I am from Taiwan.",
  ],
  xpReward: 50,
  unlockedChunkReward: "Guild Badge Phrase",
};
