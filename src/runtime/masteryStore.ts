import { SentenceMasteryEntry, SentenceMasteryMap } from "./sessionTypes";

export const SENTENCE_MASTERY_STORAGE_KEY = "sentence-combat-rpg:sentence-mastery";
export const DEFAULT_SENTENCE_MASTERY = 0.5;
const CORRECT_MASTERY_DELTA = 0.1;
const WRONG_MASTERY_DELTA = -0.1;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function clampMasteryScore(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

export function createEmptySentenceMastery(): SentenceMasteryMap {
  return {};
}

export function createDefaultSentenceMasteryEntry(): SentenceMasteryEntry {
  return {
    correct: 0,
    wrong: 0,
    mastery: DEFAULT_SENTENCE_MASTERY,
  };
}

export function getSentenceMasteryEntry(
  masteryBySentenceId: SentenceMasteryMap,
  sentenceId: string,
): SentenceMasteryEntry {
  return masteryBySentenceId[sentenceId] ?? createDefaultSentenceMasteryEntry();
}

export function getSentenceMasteryScore(
  masteryBySentenceId: SentenceMasteryMap,
  sentenceId: string,
): number {
  return getSentenceMasteryEntry(masteryBySentenceId, sentenceId).mastery;
}

export function updateSentenceMastery(
  masteryBySentenceId: SentenceMasteryMap,
  sentenceId: string,
  isCorrect: boolean,
  masteryDelta = isCorrect ? CORRECT_MASTERY_DELTA : WRONG_MASTERY_DELTA,
): SentenceMasteryMap {
  const currentEntry = getSentenceMasteryEntry(masteryBySentenceId, sentenceId);

  return {
    ...masteryBySentenceId,
    [sentenceId]: {
      correct: currentEntry.correct + (isCorrect ? 1 : 0),
      wrong: currentEntry.wrong + (isCorrect ? 0 : 1),
      mastery: clampMasteryScore(currentEntry.mastery + masteryDelta),
    },
  };
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isSentenceMasteryEntry(value: unknown): value is SentenceMasteryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SentenceMasteryEntry>;

  return (
    isFiniteNumber(candidate.correct) &&
    isFiniteNumber(candidate.wrong) &&
    isFiniteNumber(candidate.mastery)
  );
}

export function loadSentenceMastery(
  storage: StorageLike | null = getBrowserStorage(),
): SentenceMasteryMap {
  if (!storage) {
    return createEmptySentenceMastery();
  }

  const rawValue = storage.getItem(SENTENCE_MASTERY_STORAGE_KEY);

  if (!rawValue) {
    return createEmptySentenceMastery();
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsedValue)
        .filter(([, entry]) => isSentenceMasteryEntry(entry))
        .map(([sentenceId, entry]) => {
          const masteryEntry = entry as SentenceMasteryEntry;

          return [
            sentenceId,
            {
              correct: masteryEntry.correct,
              wrong: masteryEntry.wrong,
              mastery: clampMasteryScore(masteryEntry.mastery),
            },
          ];
        }),
    );
  } catch {
    return createEmptySentenceMastery();
  }
}

export function saveSentenceMastery(
  masteryBySentenceId: SentenceMasteryMap,
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) {
    return;
  }

  storage.setItem(SENTENCE_MASTERY_STORAGE_KEY, JSON.stringify(masteryBySentenceId));
}

export function clearSentenceMastery(
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) {
    return;
  }

  storage.removeItem(SENTENCE_MASTERY_STORAGE_KEY);
}

export function recordSentenceAnswer(
  sentenceId: string,
  isCorrect: boolean,
  masteryDelta?: number,
  storage: StorageLike | null = getBrowserStorage(),
): SentenceMasteryMap {
  const currentMastery = loadSentenceMastery(storage);
  const nextMastery = updateSentenceMastery(
    currentMastery,
    sentenceId,
    isCorrect,
    masteryDelta,
  );

  saveSentenceMastery(nextMastery, storage);

  return nextMastery;
}
