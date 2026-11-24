import { describe, expect, it } from "vitest";
import { clampPage, pageCount, pageRange, paginate } from "../../src/utils/pagination";

describe("pageCount", () => {
  it("向上取整", () => {
    expect(pageCount(10, 5)).toBe(2);
    expect(pageCount(11, 5)).toBe(3);
    expect(pageCount(1, 5)).toBe(1);
  });

  it("没有数据或每页大小不合法时为 0", () => {
    expect(pageCount(0, 5)).toBe(0);
    expect(pageCount(10, 0)).toBe(0);
  });
});

describe("clampPage", () => {
  it("限制在有效范围内", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(9, 5)).toBe(5);
  });

  it("没有页时返回 1", () => {
    expect(clampPage(3, 0)).toBe(1);
  });
});

describe("paginate", () => {
  const items = [1, 2, 3, 4, 5, 6, 7];

  it("取出对应页的内容", () => {
    expect(paginate(items, 1, 3)).toEqual([1, 2, 3]);
    expect(paginate(items, 2, 3)).toEqual([4, 5, 6]);
    expect(paginate(items, 3, 3)).toEqual([7]);
  });

  it("超出范围的页返回空数组", () => {
    expect(paginate(items, 4, 3)).toEqual([]);
    expect(paginate(items, 0, 3)).toEqual([]);
  });
});

describe("pageRange", () => {
  it("页数很少时全部显示", () => {
    expect(pageRange(1, 1)).toEqual([1]);
    expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("中间用省略号隔开", () => {
    expect(pageRange(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
  });

  it("靠近开头或结尾时只有一侧有省略号", () => {
    expect(pageRange(1, 10)).toEqual([1, 2, "…", 10]);
    expect(pageRange(2, 10)).toEqual([1, 2, 3, "…", 10]);
    expect(pageRange(9, 10)).toEqual([1, "…", 8, 9, 10]);
  });

  it("只省略一页时直接显示那一页", () => {
    expect(pageRange(3, 10)).toEqual([1, 2, 3, 4, "…", 10]);
    expect(pageRange(4, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("没有页时返回空数组", () => {
    expect(pageRange(1, 0)).toEqual([]);
  });
});
