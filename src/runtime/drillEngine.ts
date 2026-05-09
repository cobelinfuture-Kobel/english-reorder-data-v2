import { Chunk, DrillMode, DrillPrompt, Pattern, PlayerProgress, ValidationResult } from "./types";
import { buildPrompt } from "./sentenceEngine";

export function createDrillPrompt(pattern: Pattern, chunks: Chunk[]): DrillPrompt {
  return buildPrompt(pattern, chunks);
}

export function advanceDrillState(
  currentState: PlayerProgress,
  validationResult: ValidationResult,
): PlayerProgress {
  const nextCorrectStreak = validationResult.isCorrect ? currentState.correctStreak + 1 : 0;
  const nextIncorrectStreak = validationResult.isCorrect ? 0 : currentState.incorrectStreak + 1;
  const totalCorrect = currentState.totalCorrect + (validationResult.isCorrect ? 1 : 0);
  const totalAttempts = currentState.totalAttempts + 1;
  const accuracy = totalAttempts === 0 ? 0 : totalCorrect / totalAttempts;

  let nextMode: DrillMode = currentState.currentMode;

  if (currentState.currentMode === "LEARN" && accuracy >= 0.8 && nextCorrectStreak >= 2) {
    nextMode = "DRILL";
  } else if (currentState.currentMode === "DRILL" && accuracy >= 0.9 && nextCorrectStreak >= 3) {
    nextMode = "RAPID_RESPONSE";
  } else if (
    currentState.currentMode === "RAPID_RESPONSE" &&
    accuracy >= 0.9 &&
    nextCorrectStreak >= 4
  ) {
    nextMode = "BOSS";
  } else if (currentState.currentMode === "BOSS" && accuracy >= 0.9 && nextCorrectStreak >= 5) {
    nextMode = "MASTERED";
  } else if (!validationResult.isCorrect && nextIncorrectStreak >= 2) {
    if (currentState.currentMode === "RAPID_RESPONSE") {
      nextMode = "DRILL";
    } else if (currentState.currentMode === "BOSS") {
      nextMode = "RAPID_RESPONSE";
    }
  }

  return {
    ...currentState,
    currentMode: nextMode,
    correctStreak: nextCorrectStreak,
    incorrectStreak: nextIncorrectStreak,
    totalCorrect,
    totalAttempts,
  };
}
