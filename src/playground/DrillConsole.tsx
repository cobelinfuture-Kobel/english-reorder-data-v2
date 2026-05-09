// This is a debug gameplay prototype, not production UI.

import { useEffect, useMemo, useState } from "react";
import { initialSessionState, mockPrompts, totalPrompts } from "./mockSession";
import { validateAnswer } from "../runtime/validationEngine";
import { Chunk } from "../runtime/types";

type FeedbackState = {
  message: string;
  unlockedMessage: string;
  answered: boolean;
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

export default function DrillConsole() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [xp, setXp] = useState(initialSessionState.xp);
  const [combo, setCombo] = useState(initialSessionState.combo);
  const [unlockedChunkIds, setUnlockedChunkIds] = useState(initialSessionState.unlockedChunkIds);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "Choose an answer to begin.",
    unlockedMessage: "",
    answered: false,
  });

  const currentPrompt = mockPrompts[promptIndex];
  const selectedPromptChunks = useMemo(
    () => Object.values(currentPrompt.drillPrompt.selectedChunks) as Chunk[],
    [currentPrompt],
  );
  const comboLabel = getComboLabel(combo);
  const isRapidResponse = currentPrompt.mode === "RAPID_RESPONSE";

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
    if (promptIndex < mockPrompts.length - 1) {
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

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "640px", padding: "16px" }}>
      <h1>Sentence Combat RPG Debug Drill Console</h1>

      <div style={panelStyle}>
        <div>
          Prompt: {promptIndex + 1} / {totalPrompts}
        </div>
        <div>Mode: {currentPrompt.mode}</div>
        <div>XP: {xp}</div>
        <div>Combo: {combo}</div>
        <div>Combo Label: {comboLabel}</div>
        {isRapidResponse && <div>Timer: {timerSeconds ?? 0}s</div>}
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

      <button type="button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
