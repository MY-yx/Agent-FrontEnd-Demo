<script setup lang="ts">
import { computed } from "vue";
import { pageRange } from "../utils/pagination";

const props = defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{ "update:page": [page: number] }>();

const pages = computed(() => pageRange(props.page, props.totalPages));

function goTo(target: number): void {
  if (target < 1 || target > props.totalPages || target === props.page) return;
  emit("update:page", target);
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="分页" data-test="pagination">
    <button type="button" data-test="page-prev" :disabled="page <= 1" @click="goTo(page - 1)">上一页</button>

    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === '…'" class="pagination__gap" data-test="page-gap">…</span>
      <button
        v-else
        type="button"
        data-test="page-number"
        :class="{ 'is-active': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        @click="goTo(item)"
      >
        {{ item }}
      </button>
    </template>

    <button type="button" data-test="page-next" :disabled="page >= totalPages" @click="goTo(page + 1)">下一页</button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 16px;
}
.pagination button {
  min-width: 32px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.pagination button.is-active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination__gap {
  padding: 4px;
  color: #6b7280;
}
</style>
