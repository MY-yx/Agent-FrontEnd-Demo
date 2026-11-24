import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { useLocalStorage } from "../../src/composables/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("没有保存过时使用初始值", () => {
    const state = useLocalStorage("key", { count: 1 });
    expect(state.value).toEqual({ count: 1 });
  });

  it("读取已保存的值", () => {
    localStorage.setItem("key", JSON.stringify({ count: 5 }));
    const state = useLocalStorage("key", { count: 1 });
    expect(state.value).toEqual({ count: 5 });
  });

  it("值变化后写回 localStorage，包括深层修改", async () => {
    const state = useLocalStorage("key", { count: 1, tags: ["a"] });

    state.value.count = 2;
    await nextTick();
    expect(JSON.parse(localStorage.getItem("key")!)).toEqual({ count: 2, tags: ["a"] });

    state.value.tags.push("b");
    await nextTick();
    expect(JSON.parse(localStorage.getItem("key")!)).toEqual({ count: 2, tags: ["a", "b"] });
  });

  it("保存的内容损坏时回退到初始值", () => {
    localStorage.setItem("key", "{not json");
    const state = useLocalStorage("key", "fallback");
    expect(state.value).toBe("fallback");
  });
});
