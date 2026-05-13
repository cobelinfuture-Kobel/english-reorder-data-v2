// This is a debug gameplay prototype, not production UI.

import { useEffect, useMemo, useState } from "react";
import { createMockPrompts, initialSessionState, MockPrompt } from "./mockSession";
import {
  clearSentenceMastery,
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
  phase: "idle" | "correct_locked" | "wrong" | "timeout_locked" | "final_correct" | "complete";
};

type PersistedDrillSession = {
  prompts: MockPrompt[];
  promptIndex: number;
  xp: number;
  combo: number;
  highestCombo: number;
  replayCount: number;
  unlockedChunkIds: string[];
  sessionStartMasteryBySentenceId: SentenceMasteryMap;
  feedback: FeedbackState;
};

type DrillConsoleProps = {
  onChallengeBoss?: () => void;
};

const DRILL_CONSOLE_STORAGE_KEY = "sentence-combat-rpg:drill-console";
const defaultFeedbackState: FeedbackState = {
  message: "Choose an answer to begin.",
  unlockedMessage: "",
  phase: "idle",
};

const AUTO_ADVANCE_DELAY_MS = 1400;
const RAPID_RESPONSE_TIMER_SECONDS = 5;
const URGENT_TIMER_THRESHOLD_SECONDS = 2;
const correctFeedbackPool = ["Hit!", "Nice Flow!", "Chain!", "Pattern Mastery!", "Perfect!"];
const wrongFeedbackPool = ["Mana unstable...", "Not quite.", "Try again.", "That pattern doesn't fit."];
const timeoutFeedbackPool = ["Too Slow!", "Chain broken!", "Focus!"];

const panelStyle = {
  border: "1px solid #999",
  padding: "12px",
  marginBottom: "12px",
};

const topStatusStyle = {
  ...panelStyle,
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "8px 16px",
  alignItems: "center",
  fontSize: "14px",
};

const promptPanelStyle = {
  ...panelStyle,
};

const npcLabelStyle = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  color: "#555",
  marginBottom: "8px",
};

const npcPromptStyle = {
  fontSize: "26px",
  lineHeight: 1.35,
};

const answerPanelStyle = {
  ...panelStyle,
};

const buttonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left" as const,
  marginBottom: "12px",
  padding: "14px 16px",
  fontSize: "18px",
  lineHeight: 1.4,
};

const feedbackPanelStyle = {
  ...panelStyle,
  marginTop: "-4px",
};

const completionPanelStyle = {
  ...panelStyle,
  padding: "18px",
};

const completionTitleStyle = {
  fontSize: "28px",
  marginBottom: "12px",
};

const completionStatStyle = {
  marginBottom: "8px",
};

const urgentTimerStyle = {
  fontSize: "20px",
  fontWeight: "bold" as const,
  color: "#b00020",
};

const debugPanelStyle = {
  ...panelStyle,
  borderColor: "#bbb",
  backgroundColor: "#f7f7f7",
  fontSize: "14px",
};

const debugToggleStyle = {
  padding: "6px 10px",
  fontSize: "14px",
  marginBottom: "12px",
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

function pickFeedback(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
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
      typeof parsedValue.highestCombo !== "number" ||
      typeof parsedValue.replayCount !== "number" ||
      !Array.isArray(parsedValue.unlockedChunkIds) ||
      !parsedValue.sessionStartMasteryBySentenceId ||
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
      highestCombo: parsedValue.highestCombo,
      replayCount: parsedValue.replayCount,
      unlockedChunkIds: parsedValue.unlockedChunkIds,
      sessionStartMasteryBySentenceId:
        parsedValue.sessionStartMasteryBySentenceId as SentenceMasteryMap,
      feedback: {
        message:
          typeof parsedValue.feedback.message === "string"
            ? parsedValue.feedback.message
            : defaultFeedbackState.message,
        unlockedMessage:
          typeof parsedValue.feedback.unlockedMessage === "string"
            ? parsedValue.feedback.unlockedMessage
            : defaultFeedbackState.unlockedMessage,
        phase:
          "phase" in parsedValue.feedback &&
          typeof parsedValue.feedback.phase === "string"
            ? parsedValue.feedback.phase
            : defaultFeedbackState.phase,
      },
    };
  } catch {
    return null;
  }
}

function cloneMasteryMap(masteryBySentenceId: SentenceMasteryMap): SentenceMasteryMap {
  return Object.fromEntries(
    Object.entries(masteryBySentenceId).map(([sentenceId, entry]) => [
      sentenceId,
      { ...entry },
    ]),
  );
}

function countMasteryImprovements(
  prompts: MockPrompt[],
  startMastery: SentenceMasteryMap,
  currentMastery: SentenceMasteryMap,
): number {
  return prompts.reduce((count, prompt) => {
    const startScore = getSentenceMasteryEntry(startMastery, prompt.id).mastery;
    const currentScore = getSentenceMasteryEntry(currentMastery, prompt.id).mastery;

    return currentScore > startScore ? count + 1 : count;
  }, 0);
}

export default function DrillConsole({ onChallengeBoss }: DrillConsoleProps) {
  const persistedSession = loadPersistedSession();
  const [masteryBySentenceId, setMasteryBySentenceId] = useState<SentenceMasteryMap>(() =>
    loadSentenceMastery(),
  );
  const [replayCount, setReplayCount] = useState(persistedSession?.replayCount ?? 0);
  const [prompts, setPrompts] = useState<MockPrompt[]>(
    persistedSession?.prompts ?? createMockPrompts(masteryBySentenceId, replayCount),
  );
  const [promptIndex, setPromptIndex] = useState(persistedSession?.promptIndex ?? 0);
  const [xp, setXp] = useState(persistedSession?.xp ?? initialSessionState.xp);
  const [combo, setCombo] = useState(persistedSession?.combo ?? initialSessionState.combo);
  const [highestCombo, setHighestCombo] = useState(persistedSession?.highestCombo ?? 0);
  const [unlockedChunkIds, setUnlockedChunkIds] = useState(
    persistedSession?.unlockedChunkIds ?? initialSessionState.unlockedChunkIds,
  );
  const [sessionStartMasteryBySentenceId, setSessionStartMasteryBySentenceId] = useState<SentenceMasteryMap>(
    persistedSession?.sessionStartMasteryBySentenceId ?? cloneMasteryMap(masteryBySentenceId),
  );
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(persistedSession?.feedback ?? defaultFeedbackState);
  const [showDebug, setShowDebug] = useState(false);

  const currentPrompt = prompts[promptIndex];
  const selectedPromptChunks = useMemo(
    () => Object.values(currentPrompt.drillPrompt.selectedChunks) as Chunk[],
    [currentPrompt],
  );
  const comboLabel = getComboLabel(combo);
  const isRapidResponse = currentPrompt.mode === "RAPID_RESPONSE";
  const currentPromptMastery = getSentenceMasteryEntry(masteryBySentenceId, currentPrompt.id);
  const isFinalPrompt = promptIndex === prompts.length - 1;
  const isInteractionLocked =
    feedback.phase === "correct_locked" ||
    feedback.phase === "timeout_locked" ||
    feedback.phase === "final_correct" ||
    feedback.phase === "complete";
  const isUrgentTimer =
    isRapidResponse &&
    timerSeconds !== null &&
    timerSeconds <= URGENT_TIMER_THRESHOLD_SECONDS;
  const masteryImprovementCount = countMasteryImprovements(
    prompts,
    sessionStartMasteryBySentenceId,
    masteryBySentenceId,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistedSessionState: PersistedDrillSession = {
      prompts,
      promptIndex,
      xp,
      combo,
      highestCombo,
      replayCount,
      unlockedChunkIds,
      sessionStartMasteryBySentenceId,
      feedback,
    };

    window.localStorage.setItem(
      DRILL_CONSOLE_STORAGE_KEY,
      JSON.stringify(persistedSessionState),
    );
  }, [
    combo,
    feedback,
    highestCombo,
    promptIndex,
    prompts,
    replayCount,
    sessionStartMasteryBySentenceId,
    unlockedChunkIds,
    xp,
  ]);

  useEffect(() => {
    if (!isRapidResponse || isInteractionLocked) {
      setTimerSeconds(null);
      return;
    }

    setTimerSeconds(RAPID_RESPONSE_TIMER_SECONDS);
  }, [currentPrompt.id, feedback.phase, isInteractionLocked, isRapidResponse]);

  useEffect(() => {
    if (!isRapidResponse || isInteractionLocked || timerSeconds === null) {
      return;
    }

    if (timerSeconds <= 0) {
      setCombo(0);
      setMasteryBySentenceId(
        recordSentenceAnswer(currentPrompt.id, false, -0.1),
      );
      setFeedback({
        message: pickFeedback(timeoutFeedbackPool),
        unlockedMessage: "",
        phase: "timeout_locked",
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
  }, [currentPrompt.id, isInteractionLocked, isRapidResponse, timerSeconds]);

  useEffect(() => {
    if (
      feedback.phase !== "correct_locked" &&
      feedback.phase !== "timeout_locked" &&
      feedback.phase !== "final_correct"
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (feedback.phase === "correct_locked") {
        setPromptIndex((currentValue) => currentValue + 1);
        setFeedback(defaultFeedbackState);
        return;
      }

      if (feedback.phase === "final_correct") {
        setFeedback({
          message: "Session Complete!",
          unlockedMessage: "",
          phase: "complete",
        });
        return;
      }

      setFeedback({
        message: feedback.message,
        unlockedMessage: "",
        phase: "idle",
      });
    }, AUTO_ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  function handleAnswer(answer: string) {
    if (isInteractionLocked) {
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
      setHighestCombo((currentValue) => Math.max(currentValue, nextCombo));

      if (
        nextCombo >= 3 &&
        currentPrompt.unlockChunkId &&
        !unlockedChunkIds.includes(currentPrompt.unlockChunkId)
      ) {
        setUnlockedChunkIds([...unlockedChunkIds, currentPrompt.unlockChunkId]);
        unlockedMessage = `Unlocked chunk: ${currentPrompt.unlockChunkId}`;
      }

      setFeedback({
        message: pickFeedback(correctFeedbackPool),
        unlockedMessage,
        phase: isFinalPrompt ? "final_correct" : "correct_locked",
      });
      return;
    }

    setCombo(0);
    setFeedback({
      message: result.hint
        ? `${pickFeedback(wrongFeedbackPool)} ${result.hint}`
        : pickFeedback(wrongFeedbackPool),
      unlockedMessage: "",
      phase: "wrong",
    });
  }

  function resetRunState(nextPrompts: MockPrompt[], nextMastery: SentenceMasteryMap) {
    setPrompts(nextPrompts);
    setPromptIndex(0);
    setXp(initialSessionState.xp);
    setCombo(initialSessionState.combo);
    setHighestCombo(0);
    setUnlockedChunkIds(initialSessionState.unlockedChunkIds);
    setTimerSeconds(null);
    setFeedback(defaultFeedbackState);
    setSessionStartMasteryBySentenceId(cloneMasteryMap(nextMastery));
  }

  function handleReplaySession() {
    const nextReplayCount = replayCount + 1;
    const nextMastery = loadSentenceMastery();
    const nextPrompts = createMockPrompts(nextMastery, nextReplayCount);

    setMasteryBySentenceId(nextMastery);
    setReplayCount(nextReplayCount);
    resetRunState(nextPrompts, nextMastery);
  }

  function handleResetPractice() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRILL_CONSOLE_STORAGE_KEY);
    }

    clearSentenceMastery();
    const nextMastery = loadSentenceMastery();
    const nextPrompts = createMockPrompts(nextMastery, 0);

    setMasteryBySentenceId(nextMastery);
    setReplayCount(0);
    resetRunState(nextPrompts, nextMastery);
  }

  if (feedback.phase === "complete") {
    return (
      <div style={{ fontFamily: "sans-serif", maxWidth: "640px", padding: "16px" }}>
        <h1>Sentence Combat RPG</h1>

        <div style={completionPanelStyle}>
          <div style={completionTitleStyle}>Session Complete!</div>
          <div style={completionStatStyle}>XP Earned: {xp}</div>
          <div style={completionStatStyle}>Highest Combo: {highestCombo}</div>
          <div style={completionStatStyle}>Prompts Completed: {prompts.length}</div>
          <div style={completionStatStyle}>Mastery Improved: {masteryImprovementCount}</div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <button type="button" onClick={handleReplaySession} style={{ marginRight: "8px" }}>
            Replay Session
          </button>
          <button
            type="button"
            onClick={() => onChallengeBoss?.()}
            style={{ marginRight: "8px" }}
          >
            Challenge Boss
          </button>
          <button type="button" onClick={handleResetPractice}>
            Reset Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "640px", padding: "16px" }}>
      <h1>Sentence Combat RPG</h1>

      <div style={topStatusStyle}>
        <div>
          {promptIndex + 1} / {prompts.length}
        </div>
        <div>XP: {xp}</div>
        <div>Combo: {combo}</div>
        <div>Combo Label: {comboLabel}</div>
        {isRapidResponse && (
          <div style={isUrgentTimer ? urgentTimerStyle : undefined}>
            Timer: {timerSeconds ?? 0}s
          </div>
        )}
      </div>

      <div style={promptPanelStyle}>
        <div style={npcLabelStyle}>NPC</div>
        <div style={npcPromptStyle}>{currentPrompt.npcPrompt}</div>
      </div>

      <div style={answerPanelStyle}>
        <div style={{ marginBottom: "12px", fontSize: "14px", color: "#555" }}>Choose your answer.</div>
        {currentPrompt.choices.map((choice) => (
          <button
            key={choice.id}
            style={buttonStyle}
            type="button"
            onClick={() => handleAnswer(choice.answer)}
            disabled={isInteractionLocked || (isRapidResponse && timerSeconds === 0)}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div style={feedbackPanelStyle}>
        <div>{feedback.message}</div>
        {feedback.unlockedMessage ? (
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#555" }}>
            {feedback.unlockedMessage}
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <button type="button" onClick={handleResetPractice}>
          Reset Practice
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowDebug((currentValue) => !currentValue)}
          style={debugToggleStyle}
        >
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      {showDebug ? (
        <div style={debugPanelStyle}>
          <div>Expected: {currentPrompt.drillPrompt.expectedAnswer}</div>
          <div>Mode: {currentPrompt.mode}</div>
          <div>
            Sample Chunks:{" "}
            {selectedPromptChunks.length > 0
              ? selectedPromptChunks.map((chunk) => chunk.text).join(", ")
              : "none"}
          </div>
          <div>
            Mastery: {currentPromptMastery.mastery.toFixed(2)} ({currentPromptMastery.correct}C /{" "}
            {currentPromptMastery.wrong}W)
          </div>
          <div>
            Grammar Bank: {unlockedChunkIds.length > 0 ? unlockedChunkIds.join(", ") : "empty"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
