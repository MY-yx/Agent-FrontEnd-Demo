import { computed, ref, watch, type Ref } from "vue";
import { clampPage, pageCount, paginate } from "../utils/pagination";

export function usePagination<T>(items: Ref<T[]>, pageSize = 6) {
  const page = ref(1);

  /** 总页数，至少为 1（没有数据时也显示第 1 页） */
  const totalPages = computed(() => Math.max(1, pageCount(items.value.length, pageSize)));

  const pageItems = computed(() => paginate(items.value, page.value, pageSize));

  // 列表内容变化（例如换了筛选条件）后回到第一页，避免停在一个已经不存在的页码上
  watch(items, () => {
    page.value = 1;
  });

  function goTo(target: number): void {
    page.value = clampPage(target, totalPages.value);
  }

  function next(): void {
    goTo(page.value + 1);
  }

  function prev(): void {
    goTo(page.value - 1);
  }

  return { page, totalPages, pageItems, goTo, next, prev };
}
