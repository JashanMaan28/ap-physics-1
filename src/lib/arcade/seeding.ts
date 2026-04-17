export function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

export function pickDeterministic<T>(items: T[], seed: string, count: number): T[] {
  if (items.length <= count) {
    return items;
  }

  const working = [...items];
  const selected: T[] = [];
  let hash = hashSeed(seed);

  while (selected.length < count && working.length > 0) {
    const index = hash % working.length;
    selected.push(working.splice(index, 1)[0]);
    hash = (hash * 1664525 + 1013904223) >>> 0;
  }

  return selected;
}
