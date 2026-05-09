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
  return (sentence.chunks ?? []).map((chunk) => ({
    id: toChunkId(chunk.text),
    text: chunk.text,
    slotType: semanticGroupToSlotType(chunk.semantic_group),
    scenarioSource: sentence.scenario_id,
    unlockedByDefault: false,
  }));
}

function sentenceToSlotSelections(sentence: OfficialSentenceEntry): Record<string, string> | undefined {
  if (!sentence.slots) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(sentence.slots).map(([slotName, slotValue]) => [slotName, toChunkId(slotValue)]),
  );
}

function choosePlayableSentences(sentences: OfficialSentenceEntry[]): RegistrySentence[] {
  const byId = new Map(sentences.map((sentence) => [sentence.id, sentence]));
  const selectedIds = [
    "A1_01_personal_info_0004",
    "A1_01_personal_info_0001",
    "A1_01_personal_info_0002",
    "A1_01_personal_info_0005",
    "A1_01_personal_info_0005",
  ];

  return selectedIds.reduce<RegistrySentence[]>((playableSentences, id, index) => {
    const sentence = byId.get(id);

    if (!sentence) {
      return playableSentences;
    }

    const commonFields = {
      scenarioId: sentence.scenario_id,
      pattern: sentence.pattern,
      grammarTags: sentence.grammar,
      chunkPool: sentenceToChunkPool(sentence),
      slotSelections: sentenceToSlotSelections(sentence),
    };

    if (index === 0) {
      playableSentences.push(
        {
          id: sentence.id,
          mode: "LEARN",
          npcPrompt: "How are you?",
          expectedAnswer: sentence.text,
          answerChoices: ["I am happy.", "I am seven years old.", "Yes, I am."],
          unlockableChunkId: "happy",
          ...commonFields,
        },
      );
      return playableSentences;
    }

    if (index === 1) {
      playableSentences.push(
        {
          id: sentence.id,
          mode: "DRILL",
          npcPrompt: "How old are you?",
          expectedAnswer: sentence.text,
          answerChoices: ["I am seven years old.", "I am happy.", "Are you a student?"],
          unlockableChunkId: "seven_years_old",
          ...commonFields,
        },
      );
      return playableSentences;
    }

    if (index === 2) {
      playableSentences.push(
        {
          id: sentence.id,
          mode: "DRILL",
          npcPrompt: sentence.text,
          expectedAnswer: sentence.text,
          answerChoices: ["Are you a student?", "Are you tired?", "I am seven years old."],
          unlockableChunkId: "a_student",
          ...commonFields,
        },
      );
      return playableSentences;
    }

    if (index === 3) {
      playableSentences.push(
        {
          id: `${sentence.id}_yes`,
          mode: "RAPID_RESPONSE",
          npcPrompt: sentence.text,
          expectedAnswer: sentence.expected_answers?.yes ?? "Yes, I am.",
          answerChoices: [
            sentence.expected_answers?.yes ?? "Yes, I am.",
            sentence.expected_answers?.no ?? "No, I'm not.",
            sentence.text,
          ],
          timerSeconds: 3,
          ...commonFields,
        },
      );
      return playableSentences;
    }

    playableSentences.push(
      {
        id: `${sentence.id}_no`,
        mode: "RAPID_RESPONSE",
        npcPrompt: sentence.text,
        expectedAnswer: sentence.expected_answers?.no ?? "No, I'm not.",
        answerChoices: [
          sentence.expected_answers?.no ?? "No, I'm not.",
          sentence.expected_answers?.yes ?? "Yes, I am.",
          sentence.text,
        ],
        timerSeconds: 3,
        ...commonFields,
      },
    );

    return playableSentences;
  }, []);
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
