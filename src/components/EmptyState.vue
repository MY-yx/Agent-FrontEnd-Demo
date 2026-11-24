<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="empty" data-test="empty-state">
    <p class="empty__title">{{ title }}</p>
    <p v-if="description" class="empty__description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  padding: 32px 16px;
  text-align: center;
  color: #6b7280;
}
.empty__title {
  font-size: 16px;
  color: #111827;
}
</style>
