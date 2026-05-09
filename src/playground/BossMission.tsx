// This is a debug gameplay prototype, not production UI.

import { useMemo, useState } from "react";
import { bossMissionData, BossChunk, BossMissionTemplate } from "./bossMissionData";
import { getAllowedChunks, renderPattern } from "../runtime/sentenceEngine";
import { validateSlotAnswer } from "../runtime/validationEngine";

type FeedbackState = {
  message: string;
  success: boolean;
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

function getSelectedChunkRecord(
  template: BossMissionTemplate,
  selectedChunk: BossChunk | null,
): Record<string, BossChunk> {
  if (!selectedChunk || template.pattern.slots.length === 0) {
    return {};
  }

  return {
    [template.pattern.slots[0].name]: selectedChunk,
  };
}

export default function BossMission() {
  const [templateIndex, setTemplateIndex] = useState(0);
  const [selectedChunk, setSelectedChunk] = useState<BossChunk | null>(null);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "Choose a chunk to begin your guild introduction.",
    success: false,
  });
  const [missionComplete, setMissionComplete] = useState(false);

  const currentTemplate = bossMissionData.templates[templateIndex];

  const allowedChunks = useMemo(() => {
    if (!currentTemplate) {
      return [];
    }

    return getAllowedChunks(currentTemplate.pattern, currentTemplate.pattern.slots[0].name, bossMissionData.availableChunks);
  }, [currentTemplate]);

  const previewSentence = useMemo(() => {
    if (!currentTemplate || !selectedChunk) {
      return currentTemplate?.pattern.template ?? "";
    }

    return renderPattern(currentTemplate.pattern, getSelectedChunkRecord(currentTemplate, selectedChunk));
  }, [currentTemplate, selectedChunk]);

  function handleChunkSelect(chunk: BossChunk) {
    if (!currentTemplate || missionComplete) {
      return;
    }

    const isAllowed = allowedChunks.some((allowedChunk) => allowedChunk.id === chunk.id);

    if (!isAllowed) {
      setSelectedChunk(null);
      setFeedback({
        message: "Mana unstable... This chunk does not fit here.",
        success: false,
      });
      return;
    }

    setSelectedChunk(chunk);
    setFeedback({
      message: "Chunk aligned. Confirm the sentence when ready.",
      success: false,
    });
  }

  function handleConfirmSentence() {
    if (!currentTemplate || !selectedChunk) {
      setFeedback({
        message: "Mana unstable... Choose a chunk first.",
        success: false,
      });
      return;
    }

    const selectedChunks = getSelectedChunkRecord(currentTemplate, selectedChunk);
    const renderedSentence = renderPattern(currentTemplate.pattern, selectedChunks);
    const validationResult = validateSlotAnswer(
      currentTemplate.pattern,
      selectedChunks,
      renderedSentence,
    );

    if (!validationResult.isCorrect) {
      setFeedback({
        message: validationResult.hint
          ? `Mana unstable... ${validationResult.hint}`
          : "Mana unstable... This chunk does not fit here.",
        success: false,
      });
      return;
    }

    const nextCompletedSentences = [...completedSentences, renderedSentence];
    const nextIndex = templateIndex + 1;

    setCompletedSentences(nextCompletedSentences);
    setSelectedChunk(null);

    if (nextIndex >= bossMissionData.templates.length) {
      setMissionComplete(true);
      setFeedback({
        message: "Guild introduction successful.",
        success: true,
      });
      return;
    }

    setTemplateIndex(nextIndex);
    setFeedback({
      message: "Sentence locked in. Prepare the next line.",
      success: true,
    });
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "720px", padding: "16px" }}>
      <h1>{bossMissionData.title}</h1>
      <div style={panelStyle}>{bossMissionData.description}</div>

      <div style={panelStyle}>
        <div>
          Mission Progress: {completedSentences.length} / {bossMissionData.templates.length}
        </div>
        {!missionComplete && currentTemplate && (
          <>
            <div>Current Template: {currentTemplate.pattern.template}</div>
            <div>Selected Chunk: {selectedChunk ? selectedChunk.displayText : "none"}</div>
            <div>Sentence Preview: {previewSentence}</div>
          </>
        )}
        {missionComplete && (
          <>
            <div>Mission Complete</div>
            <div>XP Reward: {bossMissionData.xpReward}</div>
            <div>Unlocked Reward: {bossMissionData.unlockedChunkReward}</div>
          </>
        )}
      </div>

      {!missionComplete && (
        <div style={panelStyle}>
          <div>Available Chunks</div>
          {bossMissionData.availableChunks.map((chunk) => (
            <button
              key={chunk.id}
              type="button"
              style={buttonStyle}
              onClick={() => handleChunkSelect(chunk)}
            >
              {chunk.displayText}
            </button>
          ))}
        </div>
      )}

      {!missionComplete && (
        <div style={panelStyle}>
          <button type="button" style={buttonStyle} onClick={handleConfirmSentence}>
            Confirm Sentence
          </button>
        </div>
      )}

      <div style={panelStyle}>
        <div>Completed Sentences</div>
        {completedSentences.length === 0 && <div>none yet</div>}
        {completedSentences.map((sentence, index) => (
          <div key={`${sentence}-${index}`}>{sentence}</div>
        ))}
      </div>

      <div style={panelStyle}>
        <div>Expected Solutions</div>
        {bossMissionData.expectedSolutions.map((solution) => (
          <div key={solution}>{solution}</div>
        ))}
      </div>

      <div style={panelStyle}>
        <div>Feedback: {feedback.message}</div>
        <div>Status: {feedback.success ? "stable" : "unstable"}</div>
      </div>
    </div>
  );
}
