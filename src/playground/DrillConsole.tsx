// This is a debug gameplay prototype, not production UI.

import { useEffect, useMemo, useState } from "react";
import { createMockPrompts, initialSessionState, MockPrompt } from "./mockSession";
import {
  getSentenceMasteryEntry,
  loadSentenceMastery,
  recordSentenceAnswer,
} from "../runtime/masteryStore";
import { validateAnswer } from "../runtime/validationEngine";
import { Chunk } from "../runtime/types";
import { SentenceMasteryMap } from "../runtime/sessionTypes";

type FeedbackState = {
  message: string;
  unlockedMessage: string;
  answered: boolean;
};

type PersistedDrillSession = {
  prompts: MockPrompt[];
  promptIndex: number;
  xp: number;
  combo: number;
  unlockedChunkIds: string[];
  feedback: FeedbackState;
};

const DRILL_CONSOLE_STORAGE_KEY = "sentence-combat-rpg:drill-console";
const defaultFeedbackState: FeedbackState = {
  message: "Choose an answer to begin.",
  unlockedMessage: "",
  answered: false,
};

const panelStyle = {
  border: "1px solid #999",
  padding: "12px",
  marginBottom: "12px",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left" as const,
  marginBottom: "8px",
  padding: "8px",
};

function getComboLabel(combo: number): string {
  if (combo >= 10) {
    return "Automatic Mode";
  }

  if (combo >= 8) {
    return "Pattern Mastery";
  }

  if (combo >= 5) {
    return "Sentence Chain";
  }

  if (combo >= 3) {
    return "Nice Flow";
  }

  return "Warm Up";
}

function getCorrectFeedback(comboAfterAnswer: number): string {
  if (comboAfterAnswer >= 8) {
    return "Pattern Mastery.";
  }

  if (comboAfterAnswer >= 5) {
    return "Sentence Chain.";
  }

  if (comboAfterAnswer >= 3) {
    return "Nice Flow.";
  }

  return "Correct.";
}

function clampPromptIndex(promptIndex: number, totalPrompts: number): number {
  if (Number.isNaN(promptIndex) || promptIndex < 0) {
    return 0;
  }

  if (totalPrompts <= 0) {
    return 0;
  }

  if (promptIndex >= totalPrompts) {
    return totalPrompts - 1;
  }

  return promptIndex;
}

function loadPersistedSession(): PersistedDrillSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(DRILL_CONSOLE_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<PersistedDrillSession>;

    if (
      !Array.isArray(parsedValue.prompts) ||
      typeof parsedValue.promptIndex !== "number" ||
      typeof parsedValue.xp !== "number" ||
      typeof parsedValue.combo !== "number" ||
      !Array.isArray(parsedValue.unlockedChunkIds) ||
      !parsedValue.feedback
    ) {
      return null;
    }

    const prompts = parsedValue.prompts as MockPrompt[];

    if (prompts.length === 0) {
      return null;
    }

    return {
      prompts,
      promptIndex: clampPromptIndex(parsedValue.promptIndex, prompts.length),
      xp: parsedValue.xp,
      combo: parsedValue.combo,
      unlockedChunkIds: parsedValue.unlockedChunkIds,
      feedback: {
        message:
          typeof parsedValue.feedback.message === "string"
            ? parsedValue.feedback.message
            : defaultFeedbackState.message,
        unlockedMessage:
          typeof parsedValue.feedback.unlockedMessage === "string"
            ? parsedValue.feedback.unlockedMessage
            : defaultFeedbackState.unlockedMessage,
        answered:
          typeof parsedValue.feedback.answered === "boolean"
            ? parsedValue.feedback.answered
            : defaultFeedbackState.answered,
      },
    };
  } catch {
    return null;
  }
}

export default function DrillConsole() {
  const persistedSession = loadPersistedSession();
  const [masteryBySentenceId, setMasteryBySentenceId] = useState<SentenceMasteryMap>(() =>
    loadSentenceMastery(),
  );
  const [prompts, setPrompts] = useState<MockPrompt[]>(
    persistedSession?.prompts ?? createMockPrompts(masteryBySentenceId),
  );
  const [promptIndex, setPromptIndex] = useState(persistedSession?.promptIndex ?? 0);
  const [xp, setXp] = useState(persistedSession?.xp ?? initialSessionState.xp);
  const [combo, setCombo] = useState(persistedSession?.combo ?? initialSessionState.combo);
  const [unlockedChunkIds, setUnlockedChunkIds] = useState(
    persistedSession?.unlockedChunkIds ?? initialSessionState.unlockedChunkIds,
  );
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(persistedSession?.feedback ?? defaultFeedbackState);

  const currentPrompt = prompts[promptIndex];
  const selectedPromptChunks = useMemo(
    () => Object.values(currentPrompt.drillPrompt.selectedChunks) as Chunk[],
    [currentPrompt],
  );
  const comboLabel = getComboLabel(combo);
  const isRapidResponse = currentPrompt.mode === "RAPID_RESPONSE";
  const currentPromptMastery = getSentenceMasteryEntry(masteryBySentenceId, currentPrompt.id);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedSessionState: PersistedDrillSession = {
      prompts,
      promptIndex,
      xp,
      combo,
      unlockedChunkIds,
      feedback,
    };

    window.localStorage.setItem(
      DRILL_CONSOLE_STORAGE_KEY,
      JSON.stringify(persistedSessionState),
    );
  }, [combo, feedback, promptIndex, prompts, unlockedChunkIds, xp]);

  useEffect(() => {
    if (!isRapidResponse || feedback.answered) {
      setTimerSeconds(null);
      return;
    }

    setTimerSeconds(3);
  }, [currentPrompt.id, feedback.answered, isRapidResponse]);

  useEffect(() => {
    if (!isRapidResponse || feedback.answered || timerSeconds === null) {
      return;
    }

    if (timerSeconds <= 0) {
      setCombo(0);
      setMasteryBySentenceId(
        recordSentenceAnswer(currentPrompt.id, false, -0.1),
      );
      setFeedback({
        message: "Too slow. Try again.",
        unlockedMessage: "",
        answered: true,
      });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimerSeconds((currentValue) => {
        if (currentValue === null) {
          return null;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback.answered, isRapidResponse, timerSeconds]);

  function handleAnswer(answer: string) {
    if (feedback.answered) {
      return;
    }

    const result = validateAnswer(currentPrompt.expectedAnswer, answer);
    const nextMastery = recordSentenceAnswer(
      currentPrompt.id,
      result.isCorrect,
      result.masteryDelta,
    );
    setMasteryBySentenceId(nextMastery);

    if (result.isCorrect) {
      const nextXp = xp + 10;
      const nextCombo = combo + 1;
      let unlockedMessage = "";

      setXp(nextXp);
      setCombo(nextCombo);

      if (
        nextCombo >= 3 &&
        currentPrompt.unlockChunkId &&
        !unlockedChunkIds.includes(currentPrompt.unlockChunkId)
      ) {
        setUnlockedChunkIds([...unlockedChunkIds, currentPrompt.unlockChunkId]);
        unlockedMessage = `Unlocked chunk: ${currentPrompt.unlockChunkId}`;
      }

      setFeedback({
        message: getCorrectFeedback(nextCombo),
        unlockedMessage,
        answered: true,
      });
      return;
    }

    setCombo(0);
    setFeedback({
      message: result.hint ? `Mana unstable. ${result.hint}` : "Mana unstable. Try again.",
      unlockedMessage: "",
      answered: true,
    });
  }

  function handleNext() {
    if (promptIndex < prompts.length - 1) {
      setPromptIndex(promptIndex + 1);
      setFeedback({
        message: "Choose an answer to begin.",
        unlockedMessage: "",
        answered: false,
      });
      return;
    }

    setFeedback({
      message: "Session complete. Restart the file state to replay this mock run.",
      unlockedMessage: "",
      answered: true,
    });
  }

  function handleResetSession() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRILL_CONSOLE_STORAGE_KEY);
    }

    const nextMastery = loadSentenceMastery();
    setMasteryBySentenceId(nextMastery);
    setPrompts(createMockPrompts(nextMastery));
    setPromptIndex(0);
    setXp(initialSessionState.xp);
    setCombo(initialSessionState.combo);
    setUnlockedChunkIds(initialSessionState.unlockedChunkIds);
    setTimerSeconds(null);
    setFeedback(defaultFeedbackState);
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "640px", padding: "16px" }}>
      <h1>Sentence Combat RPG Debug Drill Console</h1>

      <div style={panelStyle}>
        <div>
          Prompt: {promptIndex + 1} / {prompts.length}
        </div>
        <div>Mode: {currentPrompt.mode}</div>
        <div>XP: {xp}</div>
        <div>Combo: {combo}</div>
        <div>Combo Label: {comboLabel}</div>
        {isRapidResponse && <div>Timer: {timerSeconds ?? 0}s</div>}
        <div>
          Mastery Debug: {currentPromptMastery.mastery.toFixed(2)} ({currentPromptMastery.correct}C /{" "}
          {currentPromptMastery.wrong}W)
        </div>
      </div>

      <div style={panelStyle}>
        <div>NPC Prompt: {currentPrompt.npcPrompt}</div>
        <div>Expected Pattern: {currentPrompt.drillPrompt.expectedAnswer}</div>
        <div>
          Sample Chunks:{" "}
          {selectedPromptChunks.length > 0
            ? selectedPromptChunks.map((chunk) => chunk.text).join(", ")
            : "none"}
        </div>
      </div>

      <div style={panelStyle}>
        <div>Answer Choices</div>
        {currentPrompt.choices.map((choice) => (
          <button
            key={choice.id}
            style={buttonStyle}
            type="button"
            onClick={() => handleAnswer(choice.answer)}
            disabled={feedback.answered || (isRapidResponse && timerSeconds === 0)}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div style={panelStyle}>
        <div>Feedback: {feedback.message}</div>
        <div>Unlocked: {feedback.unlockedMessage || "none"}</div>
        <div>
          Grammar Bank: {unlockedChunkIds.length > 0 ? unlockedChunkIds.join(", ") : "empty"}
        </div>
      </div>

      <div>
        <button type="button" onClick={handleNext} style={{ marginRight: "8px" }}>
          Next
        </button>
        <button type="button" onClick={handleResetSession}>
          Reset Session
        </button>
      </div>
    </div>
  );
}
