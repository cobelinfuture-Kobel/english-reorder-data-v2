import { RegistryCombo, RegistrySentence, PlayableBossChunk, PlayableBossTemplate } from "./sessionTypes";
import { Chunk, SlotType } from "./types";

type OfficialSentenceChunk = {
  slot: string;
  text: string;
  semantic_group: string;
  form: string;
};

type OfficialSentenceEntry = {
  id: string;
  text: string;
  level: string;
  scenario_id: string;
  scenario_role: string;
  communicative_function: string;
  grammar: string[];
  pattern: string;
  slots?: Record<string, string>;
  chunks?: OfficialSentenceChunk[];
  drill_tags?: string[];
  expected_answers?: {
    yes?: string;
    no?: string;
  };
};

type OfficialSentenceRegistry = {
  metadata: {
    scenario_id: string;
    scenario_title: string;
    level: string;
  };
  sentences: OfficialSentenceEntry[];
};

type OfficialComboTemplate = {
  template_id: string;
  text: string;
  slots: string[];
};

type OfficialComboTask = {
  task_id: string;
  task_title: string;
  learning_goal: string;
  templates: OfficialComboTemplate[];
  sample_outputs?: Array<{
    text: string;
    slots_used: Record<string, string>;
  }>;
};

type OfficialComboRegistry = {
  metadata: {
    combo_id: string;
    combo_title: string;
  };
  combo_tasks: OfficialComboTask[];
};

type NormalizedSentenceRegistryResult = {
  sentences: RegistrySentence[];
  chunkCatalog: Chunk[];
};

function toChunkId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function semanticGroupToSlotType(semanticGroup: string): SlotType {
  if (semanticGroup.includes("age")) {
    return "age";
  }

  if (semanticGroup.includes("origin") || semanticGroup.includes("place")) {
    return "place";
  }

  if (semanticGroup.includes("role") || semanticGroup.includes("identity")) {
    return "identity";
  }

  if (semanticGroup.includes("family")) {
    return "family_member";
  }

  return "state";
}

function sentenceToChunkPool(sentence: OfficialSentenceEntry): Chunk[] {
  const chunkMap = new Map<string, Chunk>();

  for (const [slotName, slotValue] of Object.entries(sentence.slots ?? {})) {
    const slotType = semanticGroupToSlotType(slotName);
    const slotChunk: Chunk = {
      id: toChunkId(slotValue),
      text: slotValue,
      slotType,
      scenarioSource: sentence.scenario_id,
      unlockedByDefault: false,
    };

    chunkMap.set(slotChunk.id, slotChunk);
  }

  for (const chunk of sentence.chunks ?? []) {
    const chunkEntry: Chunk = {
      id: toChunkId(chunk.text),
      text: chunk.text,
      slotType: semanticGroupToSlotType(chunk.semantic_group),
      scenarioSource: sentence.scenario_id,
      unlockedByDefault: false,
    };

    chunkMap.set(chunkEntry.id, chunkEntry);
  }

  return Array.from(chunkMap.values());
}

function sentenceToSlotSelections(sentence: OfficialSentenceEntry): Record<string, string> | undefined {
  if (!sentence.slots) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(sentence.slots).map(([slotName, slotValue]) => [slotName, toChunkId(slotValue)]),
  );
}

function sentenceToNpcPrompt(sentence: OfficialSentenceEntry): string {
  if (sentence.text.endsWith("?")) {
    return sentence.text;
  }

  switch (sentence.communicative_function) {
    case "state_personal_age":
      return "Say your age.";
    case "state_feeling":
      return "Say how you feel.";
    case "state_negative_feeling":
      return "Say how you do not feel.";
    case "state_origin":
      return "Say where someone is from.";
    case "state_role_identity":
      return "Say who someone is.";
    case "state_weather":
      return "Say the weather.";
    default:
      return sentence.text;
  }
}

function sentenceToRegistrySentence(sentence: OfficialSentenceEntry): RegistrySentence {
  const commonFields = {
    scenarioId: sentence.scenario_id,
    mode: "DRILL" as const,
    npcPrompt: sentenceToNpcPrompt(sentence),
    expectedAnswer: sentence.text,
    pattern: sentence.pattern,
    grammarTags: sentence.grammar,
    chunkPool: sentenceToChunkPool(sentence),
    slotSelections: sentenceToSlotSelections(sentence),
    responseAnswers: sentence.expected_answers
      ? {
          yes: sentence.expected_answers.yes,
          no: sentence.expected_answers.no,
        }
      : undefined,
  };
  const unlockableChunkId = commonFields.chunkPool[0]?.id;

  return {
    id: sentence.id,
    ...commonFields,
    answerChoices: sentence.expected_answers
      ? [sentence.text, sentence.expected_answers.yes ?? "Yes, I am.", sentence.expected_answers.no ?? "No, I'm not."]
      : [sentence.text],
    distractorAnswers: sentence.expected_answers
      ? undefined
      : sentence.scenario_role === "extension"
        ? ["Yes, I am.", "No, I am not."]
        : undefined,
    unlockableChunkId,
  };
}

function choosePlayableSentences(sentences: OfficialSentenceEntry[]): RegistrySentence[] {
  return sentences.map((sentence) => {
    const registrySentence = sentenceToRegistrySentence(sentence);
    const stateChunkIds = ["happy", "hungry", "tired"];

    if (sentence.pattern === "I am {state}." || sentence.pattern === "Are you {state}?") {
      for (const chunkId of stateChunkIds) {
        if (!registrySentence.chunkPool?.some((chunk) => chunk.id === chunkId)) {
          registrySentence.chunkPool?.push({
            id: chunkId,
            text: chunkId,
            slotType: "state",
            scenarioSource: sentence.scenario_id,
            unlockedByDefault: false,
          });
        }
      }
    }

    return registrySentence;
  });
}

function collectChunkCatalog(sentences: RegistrySentence[]): Chunk[] {
  const chunkMap = new Map<string, Chunk>();

  for (const sentence of sentences) {
    for (const chunk of sentence.chunkPool ?? []) {
      if (!chunkMap.has(chunk.id)) {
        chunkMap.set(chunk.id, chunk);
      }
    }
  }

  return Array.from(chunkMap.values());
}

function slotNameToSingleSentencePattern(slotName: string, value: string) {
  if (slotName.includes("age")) {
    return {
      template: "I am {age}.",
      slotName: "age",
      slotType: "age" as SlotType,
      chunkText: value,
      expectedAnswer: `I am ${value}.`,
    };
  }

  if (slotName.includes("role")) {
    return {
      template: "I am {identity}.",
      slotName: "identity",
      slotType: "identity" as SlotType,
      chunkText: value,
      expectedAnswer: `I am ${value}.`,
    };
  }

  if (slotName.includes("feeling") || slotName.includes("trait")) {
    return {
      template: "I am {state}.",
      slotName: "state",
      slotType: "state" as SlotType,
      chunkText: value,
      expectedAnswer: `I am ${value}.`,
    };
  }

  return {
    template: "I have got {state}.",
    slotName: "state",
    slotType: "state" as SlotType,
    chunkText: value,
    expectedAnswer: `I have got ${value}.`,
  };
}

export function normalizeOfficialSentenceRegistry(
  registry: OfficialSentenceRegistry,
): NormalizedSentenceRegistryResult {
  const sentences = choosePlayableSentences(registry.sentences);
  const chunkCatalog = collectChunkCatalog(sentences);

  return {
    sentences,
    chunkCatalog,
  };
}

export function normalizeOfficialComboRegistry(
  registry: OfficialComboRegistry,
): RegistryCombo {
  const firstPlayableTask = registry.combo_tasks[0];
  const firstSampleOutput = firstPlayableTask.sample_outputs?.[0];
  const slotEntries = Object.entries(firstSampleOutput?.slots_used ?? {});

  const templates: PlayableBossTemplate[] = slotEntries.map(([slotName, value], index) => {
    const normalized = slotNameToSingleSentencePattern(slotName, value);

    return {
      id: `${firstPlayableTask.task_id}_template_${index + 1}`,
      pattern: {
        id: `${firstPlayableTask.task_id}_pattern_${index + 1}`,
        scenarioId: registry.metadata.combo_id,
        prompt: index === 0
          ? "Tell the guild about yourself."
          : index === 1
            ? "Add one more self detail."
            : "Finish your introduction.",
        template: normalized.template,
        slots: [{ name: normalized.slotName, type: normalized.slotType, required: true }],
        allowedChunkIds: [toChunkId(normalized.chunkText)],
        hint: `Use the chunk: ${normalized.chunkText}`,
      },
    };
  });

  const requiredSentences: RegistrySentence[] = slotEntries.map(([slotName, value], index) => {
    const normalized = slotNameToSingleSentencePattern(slotName, value);
    const chunkId = toChunkId(normalized.chunkText);

    return {
      id: `${firstPlayableTask.task_id}_sentence_${index + 1}`,
      scenarioId: registry.metadata.combo_id,
      mode: "BOSS",
      npcPrompt: templates[index].pattern.prompt,
      expectedAnswer: normalized.expectedAnswer,
      pattern: normalized.template,
      answerChoices: [normalized.expectedAnswer],
      grammarTags: [normalized.slotName],
      slotSelections: { [normalized.slotName]: chunkId },
      chunkPool: [
        {
          id: chunkId,
          text: normalized.chunkText,
          slotType: normalized.slotType,
          scenarioSource: registry.metadata.combo_id,
          unlockedByDefault: true,
        },
      ],
    };
  });

  const availableChunks: PlayableBossChunk[] = Array.from(
    new Map(
      slotEntries.map(([slotName, value]) => {
        const normalized = slotNameToSingleSentencePattern(slotName, value);
        const chunkId = toChunkId(normalized.chunkText);

        return [
          chunkId,
          {
            id: chunkId,
            text: normalized.chunkText,
            displayText: normalized.chunkText,
            slotType: normalized.slotType,
            scenarioSource: registry.metadata.combo_id,
            unlockedByDefault: true,
          } satisfies PlayableBossChunk,
        ];
      }),
    ).values(),
  );

  return {
    id: registry.metadata.combo_id,
    title: firstPlayableTask.task_title,
    description: firstPlayableTask.learning_goal,
    requiredSentences,
    availableChunks,
    templates,
    rewards: {
      xp: 50,
      unlockedChunkReward: "Guild Badge Phrase",
    },
  };
}
