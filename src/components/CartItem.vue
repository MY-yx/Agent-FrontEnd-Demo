<script setup lang="ts">
import { computed } from "vue";
import type { CartItemView } from "../composables/useCart";
import { formatPrice } from "../utils/format";

const props = defineProps<{ item: CartItemView }>();

const emit = defineEmits<{
  "update:quantity": [productId: number, quantity: number];
  remove: [productId: number];
}>();

/** 数量已经达到库存上限时不能再加 */
const atMax = computed(() => props.item.quantity >= props.item.product.stock);

function change(delta: number): void {
  emit("update:quantity", props.item.product.id, props.item.quantity + delta);
}
</script>

<template>
  <li class="item" data-test="cart-item">
    <div class="item__info">
      <span class="item__name" data-test="item-name">{{ item.product.name }}</span>
      <span class="item__price">{{ formatPrice(item.product.price) }}</span>
    </div>

    <div class="item__quantity">
      <button type="button" data-test="decrease" aria-label="减少数量" @click="change(-1)">−</button>
      <span data-test="quantity">{{ item.quantity }}</span>
      <button type="button" data-test="increase" aria-label="增加数量" :disabled="atMax" @click="change(1)">+</button>
    </div>

    <span class="item__total" data-test="line-total">{{ formatPrice(item.lineTotal) }}</span>
    <button type="button" class="item__remove" data-test="remove" @click="emit('remove', item.product.id)">移除</button>
  </li>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}
.item__info {
  display: flex;
  flex-direction: column;
}
.item__price {
  font-size: 12px;
  color: #6b7280;
}
.item__quantity {
  display: flex;
  gap: 8px;
  align-items: center;
}
.item__total {
  min-width: 80px;
  text-align: right;
  font-weight: 600;
}
.item__remove {
  border: none;
  background: none;
  color: #b91c1c;
  cursor: pointer;
}
</style>
