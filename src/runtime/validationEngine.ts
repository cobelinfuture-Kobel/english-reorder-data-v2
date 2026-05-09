import { Chunk, Pattern, ValidationResult } from "./types";
import { renderPattern } from "./sentenceEngine";

export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ");
}

export function validateAnswer(expectedAnswer: string, playerAnswer: string): ValidationResult {
  const normalizedExpected = normalizeAnswer(expectedAnswer);
  const normalizedPlayer = normalizeAnswer(playerAnswer);

  if (!normalizedPlayer) {
    return {
      isCorrect: false,
      errorType: "EMPTY",
      correctedAnswer: expectedAnswer,
      hint: "Try answering with the full sentence pattern.",
      masteryDelta: -0.05,
    };
  }

  if (normalizedExpected === normalizedPlayer) {
    return {
      isCorrect: true,
      errorType: "NONE",
      correctedAnswer: expectedAnswer,
      hint: "Clean response.",
      masteryDelta: 0.1,
    };
  }

  return {
    isCorrect: false,
    errorType: "MISMATCH",
    correctedAnswer: expectedAnswer,
    hint: "Use the same pattern with the correct chunk.",
    masteryDelta: -0.02,
  };
}

export function validateSlotAnswer(
  pattern: Pattern,
  selectedChunks: Record<string, Chunk>,
  playerAnswer: string,
): ValidationResult {
  const expectedAnswer = renderPattern(pattern, selectedChunks);
  const baseResult = validateAnswer(expectedAnswer, playerAnswer);

  if (baseResult.isCorrect) {
    return baseResult;
  }

  const normalizedPlayer = normalizeAnswer(playerAnswer);
  const expectedChunks = Object.values(selectedChunks).map((chunk) => normalizeAnswer(chunk.text));
  const missingChunk = expectedChunks.some((chunkText) => !normalizedPlayer.includes(chunkText));

  if (missingChunk) {
    return {
      ...baseResult,
      errorType: "SLOT_MISMATCH",
      hint: `Use the correct chunk in: ${expectedAnswer}`,
      masteryDelta: -0.03,
    };
  }

  return baseResult;
}
