// This is a debug gameplay prototype, not production UI.

import { useState } from "react";
import DrillConsole from "./DrillConsole";
import BossMission from "./BossMission";

type PlaygroundView = "drill" | "boss";

const buttonStyle = {
  padding: "8px 12px",
  marginRight: "8px",
  border: "1px solid #999",
  background: "#f5f5f5",
  cursor: "pointer",
};

const activeButtonStyle = {
  ...buttonStyle,
  background: "#ddd",
  fontWeight: "bold" as const,
};

export default function PlaygroundHub() {
  const [activeView, setActiveView] = useState<PlaygroundView>("drill");

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>Sentence Combat RPG Playground</h1>
      <div style={{ marginBottom: "12px" }}>Debug prototype only</div>

      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          style={activeView === "drill" ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView("drill")}
        >
          Drill Console
        </button>
        <button
          type="button"
          style={activeView === "boss" ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView("boss")}
        >
          Boss Mission
        </button>
      </div>

      <div>
        {activeView === "drill" ? (
          <DrillConsole onChallengeBoss={() => setActiveView("boss")} />
        ) : (
          <BossMission />
        )}
      </div>
    </div>
  );
}
