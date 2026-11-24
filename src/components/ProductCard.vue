<script setup lang="ts">
import { computed } from "vue";
import { CATEGORY_LABELS } from "../data/products";
import type { Product } from "../types";
import { formatPrice, formatRating, stockLabel } from "../utils/format";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ add: [productId: number] }>();

const soldOut = computed(() => props.product.stock <= 0);
</script>

<template>
  <article class="card" :class="{ 'card--sold-out': soldOut }" data-test="product-card">
    <span class="card__category">{{ CATEGORY_LABELS[product.category] }}</span>
    <h3 class="card__name" data-test="product-name">{{ product.name }}</h3>
    <p class="card__price" data-test="product-price">{{ formatPrice(product.price) }}</p>
    <p class="card__meta">
      <span data-test="product-rating">评分 {{ formatRating(product.rating) }}</span>
      <span data-test="product-stock">{{ stockLabel(product.stock) }}</span>
    </p>
    <BaseButton :disabled="soldOut" data-test="add-button" @click="emit('add', product.id)">
      {{ soldOut ? "已售罄" : "加入购物车" }}
    </BaseButton>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.card--sold-out {
  opacity: 0.6;
}
.card__category {
  font-size: 12px;
  color: #6b7280;
}
.card__name {
  margin: 0;
  font-size: 15px;
}
.card__price {
  margin: 0;
  font-weight: 600;
  color: #b91c1c;
}
.card__meta {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}
</style>
