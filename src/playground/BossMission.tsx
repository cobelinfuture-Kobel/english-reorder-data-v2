// This is a debug gameplay prototype, not production UI.

import { useMemo, useState } from "react";
import { bossMissionData } from "./bossMissionData";
import { getAllowedChunks, renderPattern } from "../runtime/sentenceEngine";
import { PlayableBossChunk, PlayableBossTemplate } from "../runtime/sessionTypes";
import { validateSlotAnswer } from "../runtime/validationEngine";

type FeedbackState = {
  message: string;
  success: boolean;
};

type BossChoice = PlayableBossChunk & {
  isCorrect: boolean;
};

const panelStyle = {
  border: "1px solid #999",
  padding: "12px",
  marginBottom: "12px",
};

const previewPanelStyle = {
  ...panelStyle,
  padding: "16px",
};

const previewLabelStyle = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  color: "#555",
  marginBottom: "8px",
};

const previewTextStyle = {
  fontSize: "26px",
  lineHeight: 1.35,
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

function getSelectedChunkRecord(
  template: PlayableBossTemplate,
  selectedChunk: BossChoice | null,
): Record<string, PlayableBossChunk> {
  if (!selectedChunk || template.pattern.slots.length === 0) {
    return {};
  }

  return {
    [template.pattern.slots[0].name]: selectedChunk,
  };
}

function toTitleCase(text: string): string {
  return text.replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function createCapitalizationVariant(chunk: PlayableBossChunk): BossChoice | null {
  const variantText = toTitleCase(chunk.text);

  if (variantText === chunk.text) {
    return null;
  }

  return {
    ...chunk,
    id: `${chunk.id}-caps`,
    text: variantText,
    displayText: variantText,
    isCorrect: false,
  };
}

function createShapeVariant(chunk: PlayableBossChunk): BossChoice | null {
  let variantText = chunk.text;

  if (/\byears\b/.test(chunk.text)) {
    variantText = chunk.text.replace(/\byears\b/, "year");
  } else if (/ent\b/.test(chunk.text)) {
    variantText = chunk.text.replace(/ent\b/, "ant");
  } else if (/(.)\1/.test(chunk.text)) {
    variantText = chunk.text.replace(/(.)\1/, "$1");
  } else if (/[aeiou]/i.test(chunk.text)) {
    variantText = chunk.text.replace(/[aeiou]/i, "");
  }

  if (!variantText || variantText === chunk.text) {
    return null;
  }

  return {
    ...chunk,
    id: `${chunk.id}-shape`,
    text: variantText,
    displayText: variantText,
    isCorrect: false,
  };
}

function buildBossChoices(allowedChunks: PlayableBossChunk[]): BossChoice[] {
  const correctChunk = allowedChunks[0];

  if (!correctChunk) {
    return [];
  }

  const correctChoice: BossChoice = {
    ...correctChunk,
    isCorrect: true,
  };
  const capitalizationVariant = createCapitalizationVariant(correctChunk);
  const shapeVariant = createShapeVariant(correctChunk);

  return [correctChoice, capitalizationVariant, shapeVariant]
    .filter((choice): choice is BossChoice => Boolean(choice))
    .filter((choice, index, choices) => choices.findIndex((item) => item.text === choice.text) === index)
    .slice(0, 3);
}

export default function BossMission() {
  const [templateIndex, setTemplateIndex] = useState(0);
  const [selectedChunk, setSelectedChunk] = useState<BossChoice | null>(null);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
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

    return getAllowedChunks(
      currentTemplate.pattern,
      currentTemplate.pattern.slots[0].name,
      bossMissionData.availableChunks,
    );
  }, [currentTemplate]);

  const previewSentence = useMemo(() => {
    if (!currentTemplate || !selectedChunk) {
      return currentTemplate?.pattern.template ?? "";
    }

    return renderPattern(currentTemplate.pattern, getSelectedChunkRecord(currentTemplate, selectedChunk));
  }, [currentTemplate, selectedChunk]);
  const currentSlotName = currentTemplate?.pattern.slots[0]?.name ?? null;
  const visibleChoices = useMemo(() => buildBossChoices(allowedChunks), [allowedChunks]);

  function handleChunkSelect(chunk: BossChoice) {
    if (!currentTemplate || missionComplete) {
      return;
    }

    setSelectedChunk(chunk);
    setFeedback({
      message: chunk.isCorrect
        ? "Chunk aligned. Confirm the sentence when ready."
        : "Word power set. Cast the sentence.",
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

    if (!selectedChunk.isCorrect) {
      setFeedback({
        message: "Check the word power shape.",
        success: false,
      });
      return;
    }

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
        <div>Mission Progress: {completedSentences.length} / {bossMissionData.templates.length}</div>
        {missionComplete && (
          <>
            <div>Mission Complete</div>
            <div>XP Reward: {bossMissionData.rewards.xp}</div>
            <div>Unlocked Reward: {bossMissionData.rewards.unlockedChunkReward}</div>
          </>
        )}
      </div>

      {!missionComplete && (
        <div style={previewPanelStyle}>
          <div style={previewLabelStyle}>Your sentence</div>
          <div style={previewTextStyle}>{previewSentence}</div>
        </div>
      )}

      {!missionComplete && (
        <div style={panelStyle}>
          <div style={{ marginBottom: "12px", fontSize: "14px", color: "#555" }}>
            Choose your word power
            {currentSlotName ? ` for: ${currentSlotName}` : ""}
          </div>
          {visibleChoices.map((chunk) => (
            <button
              key={chunk.id}
              type="button"
              style={buttonStyle}
              onClick={() => handleChunkSelect(chunk)}
            >
              {"displayText" in chunk && typeof chunk.displayText === "string"
                ? chunk.displayText
                : chunk.text}
            </button>
          ))}
        </div>
      )}

      {!missionComplete && (
        <div style={panelStyle}>
          <div style={{ marginBottom: "12px" }}>
            <button type="button" style={buttonStyle} onClick={handleConfirmSentence}>
              Cast Sentence
            </button>
          </div>
          <div>{feedback.message}</div>
        </div>
      )}

      <div style={panelStyle}>
        <div>Completed Lines</div>
        {completedSentences.length === 0 && <div>none yet</div>}
        {completedSentences.map((sentence, index) => (
          <div key={`${sentence}-${index}`}>{sentence}</div>
        ))}
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
          {!missionComplete && currentTemplate && (
            <>
              <div>Current Template: {currentTemplate.pattern.template}</div>
              <div>Selected Chunk: {selectedChunk ? selectedChunk.displayText ?? selectedChunk.text : "none"}</div>
            </>
          )}
          <div>Status: {feedback.success ? "stable" : "unstable"}</div>
          <div>Source Combo: {bossMissionData.sourceComboId}</div>
          <div>Expected Solutions</div>
          {bossMissionData.requiredSentences.map((solution) => (
            <div key={solution}>{solution}</div>
          ))}
          <div>
            Raw Rewards: XP {bossMissionData.rewards.xp} / {bossMissionData.rewards.unlockedChunkReward}
          </div>
        </div>
      ) : null}
    </div>
  );
}
