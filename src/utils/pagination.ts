/** 总页数 */
export function pageCount(total: number, pageSize: number): number {
  if (pageSize <= 0 || total <= 0) return 0;
  return Math.ceil(total / pageSize);
}

/** 把页码限制在 1 到 totalPages 之间 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), totalPages);
}

/** 取出第 page 页的内容，页码从 1 开始 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  if (page < 1 || pageSize <= 0) return [];
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * 生成分页器要显示的页码序列，中间省略的部分用 "…" 表示。
 * 始终显示第一页、最后一页，以及当前页前后各 siblings 页。
 * 如果省略的只有一页，直接显示那一页而不是省略号。
 * 例如 pageRange(5, 10) -> [1, "…", 4, 5, 6, "…", 10]
 */
export function pageRange(current: number, total: number, siblings = 1): (number | "…")[] {
  if (total <= 0) return [];

  const pages = new Set<number>([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let previous = 0;

  for (const page of sorted) {
    const gap = page - previous;
    if (gap === 2) result.push(previous + 1);
    else if (gap > 2) result.push("…");
    result.push(page);
    previous = page;
  }

  return result;
}
