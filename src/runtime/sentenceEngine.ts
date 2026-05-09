import { Chunk, DrillPrompt, Pattern } from "./types";

export function renderPattern(pattern: Pattern, selectedChunks: Record<string, Chunk>): string {
  return pattern.slots.reduce((rendered, slot) => {
    const selectedChunk = selectedChunks[slot.name];
    const replacement = selectedChunk ? selectedChunk.text : `{${slot.name}}`;
    return rendered.replace(`{${slot.name}}`, replacement);
  }, pattern.template);
}

export function getAllowedChunks(pattern: Pattern, slotName: string, chunks: Chunk[]): Chunk[] {
  const slot = pattern.slots.find((item) => item.name === slotName);

  if (!slot) {
    return [];
  }

  return chunks.filter(
    (chunk) => chunk.slotType === slot.type && pattern.allowedChunkIds.includes(chunk.id),
  );
}

export function buildPrompt(pattern: Pattern, chunks: Chunk[]): DrillPrompt {
  const selectedChunks: Record<string, Chunk> = {};

  for (const slot of pattern.slots) {
    const allowedChunks = getAllowedChunks(pattern, slot.name, chunks);

    if (allowedChunks.length > 0) {
      selectedChunks[slot.name] = allowedChunks[0];
    }
  }

  return {
    patternId: pattern.id,
    promptText: pattern.prompt,
    expectedAnswer: renderPattern(pattern, selectedChunks),
    selectedChunks,
  };
}
