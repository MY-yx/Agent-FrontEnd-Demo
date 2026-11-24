import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { usePagination } from "../../src/composables/usePagination";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

describe("usePagination", () => {
  it("计算总页数和当前页的内容", () => {
    const { page, totalPages, pageItems } = usePagination(ref(range(7)), 3);
    expect(page.value).toBe(1);
    expect(totalPages.value).toBe(3);
    expect(pageItems.value).toEqual([1, 2, 3]);
  });

  it("next 和 prev 翻页，不会越界", () => {
    const { page, pageItems, next, prev } = usePagination(ref(range(7)), 3);
    prev();
    expect(page.value).toBe(1);

    next();
    next();
    expect(page.value).toBe(3);
    expect(pageItems.value).toEqual([7]);

    next();
    expect(page.value).toBe(3);
  });

  it("goTo 跳到指定页，超出范围时取最近的有效页", () => {
    const { page, goTo } = usePagination(ref(range(7)), 3);
    goTo(2);
    expect(page.value).toBe(2);
    goTo(99);
    expect(page.value).toBe(3);
    goTo(-5);
    expect(page.value).toBe(1);
  });

  it("没有数据时总页数为 1，内容为空", () => {
    const { totalPages, pageItems } = usePagination(ref<number[]>([]), 3);
    expect(totalPages.value).toBe(1);
    expect(pageItems.value).toEqual([]);
  });

  it("列表变化后回到第一页", async () => {
    const items = ref(range(7));
    const { page, pageItems, goTo } = usePagination(items, 3);
    goTo(3);

    items.value = range(4);
    await nextTick();

    expect(page.value).toBe(1);
    expect(pageItems.value).toEqual([1, 2, 3]);
  });
});
