import { describe, expect, it } from "vitest";
import { chunk, groupBy, sortBy, sum, unique } from "../../src/utils/array";

describe("groupBy", () => {
  it("按 key 分组并保持组内顺序", () => {
    const result = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd"));
    expect(result).toEqual({ odd: [1, 3, 5], even: [2, 4] });
  });

  it("空数组返回空对象", () => {
    expect(groupBy([], () => "x")).toEqual({});
  });
});

describe("sortBy", () => {
  const people = [
    { name: "b", age: 30 },
    { name: "a", age: 25 },
    { name: "c", age: 30 },
  ];

  it("默认升序", () => {
    expect(sortBy(people, (p) => p.age).map((p) => p.name)).toEqual(["a", "b", "c"]);
  });

  it("支持降序，值相同时保持原有顺序", () => {
    expect(sortBy(people, (p) => p.age, "desc").map((p) => p.name)).toEqual(["b", "c", "a"]);
  });

  it("不修改原数组", () => {
    const original = [3, 1, 2];
    sortBy(original, (n) => n);
    expect(original).toEqual([3, 1, 2]);
  });
});

describe("unique", () => {
  it("去重并保留第一次出现的顺序", () => {
    expect(unique([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });
});

describe("chunk", () => {
  it("按指定大小切分，最后一组可以不满", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("size 不是正数时返回空数组", () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
    expect(chunk([1, 2, 3], -1)).toEqual([]);
  });
});

describe("sum", () => {
  it("求和，空数组为 0", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
  });
});
