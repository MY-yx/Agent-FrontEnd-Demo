import { computed, ref, type Ref } from "vue";
import type { Category, Product, SortKey } from "../types";
import { sortBy } from "../utils/array";

/** 按指定方式排序，返回新数组 */
export function sortProducts(products: Product[], key: SortKey): Product[] {
  switch (key) {
    case "price-asc":
      return sortBy(products, (p) => p.price, "asc");
    case "price-desc":
      return sortBy(products, (p) => p.price, "desc");
    case "rating":
      return sortBy(products, (p) => p.rating, "desc");
    case "newest":
      return sortBy(products, (p) => p.createdAt, "desc");
  }
}

/** 关键词是否匹配商品：在名称和标签里查找，忽略大小写和首尾空格。空关键词匹配所有商品 */
export function matchesKeyword(product: Product, keyword: string): boolean {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return true;
  if (product.name.toLowerCase().includes(normalized)) return true;
  return product.tags.some((tag) => tag.toLowerCase().includes(normalized));
}

export function useProductFilter(products: Ref<Product[]>) {
  const keyword = ref("");
  const category = ref<Category | "all">("all");
  /** 价格下限和上限（分），null 表示不限 */
  const minPrice = ref<number | null>(null);
  const maxPrice = ref<number | null>(null);
  const inStockOnly = ref(false);
  const sort = ref<SortKey>("newest");

  const filtered = computed(() => {
    const list = products.value.filter((product) => {
      if (!matchesKeyword(product, keyword.value)) return false;
      if (category.value !== "all" && product.category !== category.value) return false;
      if (minPrice.value !== null && product.price < minPrice.value) return false;
      if (maxPrice.value !== null && product.price > maxPrice.value) return false;
      if (inStockOnly.value && product.stock <= 0) return false;
      return true;
    });
    return sortProducts(list, sort.value);
  });

  /** 是否设置了任何筛选条件（排序不算） */
  const isFiltering = computed(
    () =>
      keyword.value.trim() !== "" ||
      category.value !== "all" ||
      minPrice.value !== null ||
      maxPrice.value !== null ||
      inStockOnly.value,
  );

  /** 清空所有筛选条件，排序方式保持不变 */
  function reset(): void {
    keyword.value = "";
    category.value = "all";
    minPrice.value = null;
    maxPrice.value = null;
    inStockOnly.value = false;
  }

  return { keyword, category, minPrice, maxPrice, inStockOnly, sort, filtered, isFiltering, reset };
}
