import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { matchesKeyword, sortProducts, useProductFilter } from "../../src/composables/useProductFilter";
import type { Product } from "../../src/types";

const products: Product[] = [
  { id: 1, name: "Vue 实战", category: "book", price: 8000, stock: 5, rating: 4.5, createdAt: "2026-03-01T00:00:00Z", tags: ["前端"] },
  { id: 2, name: "机械键盘", category: "electronics", price: 40000, stock: 0, rating: 4.8, createdAt: "2026-01-01T00:00:00Z", tags: ["外设"] },
  { id: 3, name: "T 恤", category: "clothing", price: 6000, stock: 20, rating: 4.0, createdAt: "2026-04-01T00:00:00Z", tags: ["夏季"] },
  { id: 4, name: "React 入门", category: "book", price: 5000, stock: 8, rating: 4.2, createdAt: "2026-02-01T00:00:00Z", tags: ["前端"] },
];

const ids = (list: Product[]) => list.map((p) => p.id);

describe("matchesKeyword", () => {
  it("在名称和标签里查找，忽略大小写和首尾空格", () => {
    expect(matchesKeyword(products[0], "vue")).toBe(true);
    expect(matchesKeyword(products[0], "  前端 ")).toBe(true);
    expect(matchesKeyword(products[0], "键盘")).toBe(false);
  });

  it("空关键词匹配所有商品", () => {
    expect(matchesKeyword(products[0], "")).toBe(true);
    expect(matchesKeyword(products[0], "   ")).toBe(true);
  });
});

describe("sortProducts", () => {
  it("支持四种排序方式", () => {
    expect(ids(sortProducts(products, "price-asc"))).toEqual([4, 3, 1, 2]);
    expect(ids(sortProducts(products, "price-desc"))).toEqual([2, 1, 3, 4]);
    expect(ids(sortProducts(products, "rating"))).toEqual([2, 1, 4, 3]);
    expect(ids(sortProducts(products, "newest"))).toEqual([3, 1, 4, 2]);
  });

  it("不修改原数组", () => {
    sortProducts(products, "price-asc");
    expect(ids(products)).toEqual([1, 2, 3, 4]);
  });
});

describe("useProductFilter", () => {
  it("默认返回全部商品，按最新上架排序", () => {
    const { filtered, isFiltering } = useProductFilter(ref(products));
    expect(ids(filtered.value)).toEqual([3, 1, 4, 2]);
    expect(isFiltering.value).toBe(false);
  });

  it("按关键词筛选", () => {
    const { filtered, keyword } = useProductFilter(ref(products));
    keyword.value = "前端";
    expect(ids(filtered.value)).toEqual([1, 4]);
  });

  it("按分类筛选", () => {
    const { filtered, category } = useProductFilter(ref(products));
    category.value = "book";
    expect(ids(filtered.value)).toEqual([1, 4]);
  });

  it("按价格区间筛选，包含边界值", () => {
    const { filtered, minPrice, maxPrice } = useProductFilter(ref(products));
    minPrice.value = 5000;
    maxPrice.value = 8000;
    expect(ids(filtered.value)).toEqual([3, 1, 4]);
  });

  it("只看有货", () => {
    const { filtered, inStockOnly } = useProductFilter(ref(products));
    inStockOnly.value = true;
    expect(ids(filtered.value)).toEqual([3, 1, 4]);
  });

  it("多个条件同时生效，并可以配合排序", () => {
    const { filtered, category, inStockOnly, sort } = useProductFilter(ref(products));
    category.value = "book";
    inStockOnly.value = true;
    sort.value = "price-asc";
    expect(ids(filtered.value)).toEqual([4, 1]);
  });

  it("reset 清空筛选条件但保留排序方式", () => {
    const { filtered, keyword, category, sort, isFiltering, reset } = useProductFilter(ref(products));
    keyword.value = "vue";
    category.value = "book";
    sort.value = "price-asc";
    expect(isFiltering.value).toBe(true);

    reset();
    expect(isFiltering.value).toBe(false);
    expect(sort.value).toBe("price-asc");
    expect(ids(filtered.value)).toEqual([4, 3, 1, 2]);
  });

  it("商品列表变化后结果跟着更新", () => {
    const source = ref(products);
    const { filtered } = useProductFilter(source);
    source.value = products.slice(0, 2);
    expect(ids(filtered.value)).toEqual([1, 2]);
  });
});
