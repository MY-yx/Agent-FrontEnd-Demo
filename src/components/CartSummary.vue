<script setup lang="ts">
import { formatPrice } from "../utils/format";
import BaseButton from "./BaseButton.vue";

defineProps<{
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}>();

const emit = defineEmits<{ checkout: [] }>();
</script>

<template>
  <section class="summary" data-test="cart-summary">
    <dl>
      <div class="summary__row">
        <dt>小计（{{ count }} 件）</dt>
        <dd data-test="subtotal">{{ formatPrice(subtotal) }}</dd>
      </div>
      <div v-if="discount > 0" class="summary__row summary__row--discount">
        <dt>优惠</dt>
        <dd data-test="discount">-{{ formatPrice(discount) }}</dd>
      </div>
      <div class="summary__row">
        <dt>运费</dt>
        <dd data-test="shipping">{{ shipping === 0 ? "免运费" : formatPrice(shipping) }}</dd>
      </div>
      <div class="summary__row summary__row--total">
        <dt>合计</dt>
        <dd data-test="total">{{ formatPrice(total) }}</dd>
      </div>
    </dl>
    <BaseButton :disabled="count === 0" data-test="checkout-button" @click="emit('checkout')">去结算</BaseButton>
  </section>
</template>

<style scoped>
.summary dl {
  margin: 0 0 12px;
}
.summary__row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}
.summary__row dd {
  margin: 0;
}
.summary__row--discount {
  color: #15803d;
}
.summary__row--total {
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
}
</style>
