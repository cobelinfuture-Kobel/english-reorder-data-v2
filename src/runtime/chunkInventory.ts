import { Chunk, ChunkInventoryItem } from "./types";

export function createInitialInventory(chunks: Chunk[] = []): ChunkInventoryItem[] {
  return chunks.map((chunk) => ({
    chunkId: chunk.id,
    unlocked: Boolean(chunk.unlockedByDefault),
    uses: 0,
    correctUses: 0,
    mastery: 0,
  }));
}

export function unlockChunk(
  inventory: ChunkInventoryItem[],
  chunkId: string,
): ChunkInventoryItem[] {
  return inventory.map((item) =>
    item.chunkId === chunkId ? { ...item, unlocked: true } : item,
  );
}

export function recordChunkUse(
  inventory: ChunkInventoryItem[],
  chunkId: string,
  isCorrect: boolean,
): ChunkInventoryItem[] {
  return inventory.map((item) => {
    if (item.chunkId !== chunkId) {
      return item;
    }

    const uses = item.uses + 1;
    const correctUses = item.correctUses + (isCorrect ? 1 : 0);
    const mastery = uses === 0 ? 0 : Number((correctUses / uses).toFixed(2));

    return {
      ...item,
      unlocked: item.unlocked || isCorrect,
      uses,
      correctUses,
      mastery,
    };
  });
}

export function getUnlockedChunks(inventory: ChunkInventoryItem[]): ChunkInventoryItem[] {
  return inventory.filter((item) => item.unlocked);
}

export function getChunkMastery(
  inventory: ChunkInventoryItem[],
  chunkId: string,
): number {
  return inventory.find((item) => item.chunkId === chunkId)?.mastery ?? 0;
}
