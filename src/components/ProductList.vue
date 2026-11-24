<script setup lang="ts">
import type { Product } from "../types";
import EmptyState from "./EmptyState.vue";
import ProductCard from "./ProductCard.vue";

defineProps<{ products: Product[] }>();
const emit = defineEmits<{ add: [productId: number] }>();
</script>

<template>
  <EmptyState v-if="products.length === 0" title="没有找到商品" description="试试换个关键词或放宽筛选条件" />
  <div v-else class="grid" data-test="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" @add="emit('add', $event)" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
</style>
