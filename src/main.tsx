import React from "react";
import { createRoot } from "react-dom/client";
import PlaygroundHub from "./playground/PlaygroundHub";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element for playground mount.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <PlaygroundHub />
  </React.StrictMode>,
);
