<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

function onInput(event: Event): void {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="search">
    <input
      class="search__input"
      type="search"
      data-test="search-input"
      :value="modelValue"
      :placeholder="placeholder ?? '搜索商品名称或标签'"
      @input="onInput"
    />
    <button v-if="modelValue" class="search__clear" type="button" data-test="search-clear" @click="emit('update:modelValue', '')">
      清除
    </button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 8px;
}
.search__input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.search__clear {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}
</style>
