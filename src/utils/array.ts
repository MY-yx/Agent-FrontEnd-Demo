/** 按 keyFn 的返回值分组 */
export function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyFn(item);
    (result[key] ??= []).push(item);
  }
  return result;
}

/** 按 keyFn 的返回值排序，返回新数组，不修改原数组。值相同时保持原有顺序 */
export function sortBy<T>(items: T[], keyFn: (item: T) => number | string, direction: "asc" | "desc" = "asc"): T[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) return -1 * factor;
    if (ka > kb) return 1 * factor;
    return 0;
  });
}

/** 去重，保留第一次出现的顺序 */
export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** 把数组切成每组 size 个。size 不是正数时返回空数组 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
