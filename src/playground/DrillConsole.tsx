// This is a debug gameplay prototype, not production UI.

import { useMemo, useState } from "react";
import { mockPrompts, initialSessionState } from "./mockSession";
import { validateAnswer } from "../runtime/validationEngine";

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

export default function DrillConsole() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [xp, setXp] = useState(initialSessionState.xp);
  const [combo, setCombo] = useState(initialSessionState.combo);
  const [unlockedChunkIds, setUnlockedChunkIds] = useState(initialSessionState.unlockedChunkIds);
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "Choose an answer to begin.",
    unlockedMessage: "",
    answered: false,
  });

  const currentPrompt = mockPrompts[promptIndex];
  const selectedPromptChunks = useMemo(
    () => Object.values(currentPrompt.drillPrompt.selectedChunks),
    [currentPrompt],
  );

  function handleAnswer(answer: string) {
    const result = validateAnswer(currentPrompt.expectedAnswer, answer);

    if (result.isCorrect) {
      const nextXp = xp + 10;
      const nextCombo = combo + 1;
      let unlockedMessage = "";

      setXp(nextXp);
      setCombo(nextCombo);

      if (
        currentPrompt.unlockChunkId &&
        !unlockedChunkIds.includes(currentPrompt.unlockChunkId)
      ) {
        setUnlockedChunkIds([...unlockedChunkIds, currentPrompt.unlockChunkId]);
        unlockedMessage = `Unlocked chunk: ${currentPrompt.unlockChunkId}`;
      }

      setFeedback({
        message: `Correct. ${result.hint}`,
        unlockedMessage,
        answered: true,
      });
      return;
    }

    setCombo(0);
    setFeedback({
      message: `Not quite. ${result.hint} Correct answer: ${result.correctedAnswer}`,
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
        <div>Mode: {currentPrompt.mode}</div>
        <div>XP: {xp}</div>
        <div>Combo: {combo}</div>
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
            disabled={feedback.answered}
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
