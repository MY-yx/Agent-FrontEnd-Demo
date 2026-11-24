<script setup lang="ts">
import { ref } from "vue";
import CartItem from "./components/CartItem.vue";
import CartSummary from "./components/CartSummary.vue";
import CheckoutFormView from "./components/CheckoutForm.vue";
import CouponInput from "./components/CouponInput.vue";
import EmptyState from "./components/EmptyState.vue";
import Pagination from "./components/Pagination.vue";
import ProductList from "./components/ProductList.vue";
import SearchBar from "./components/SearchBar.vue";
import { useCart } from "./composables/useCart";
import { usePagination } from "./composables/usePagination";
import { useProductFilter } from "./composables/useProductFilter";
import { CATEGORY_LABELS, PRODUCTS } from "./data/products";
import type { CheckoutForm } from "./types";

const products = ref(PRODUCTS);
const { keyword, category, inStockOnly, sort, filtered, isFiltering, reset } = useProductFilter(products);
const { page, totalPages, pageItems, goTo } = usePagination(filtered, 6);
const cart = useCart();

const couponMessage = ref("");
const couponIsError = ref(false);
const checkingOut = ref(false);
const orderPlacedFor = ref<string | null>(null);

function onApplyCoupon(code: string): void {
  const result = cart.applyCoupon(code);
  couponMessage.value = result.message;
  couponIsError.value = !result.ok;
}

function onRemoveCoupon(): void {
  cart.removeCoupon();
  couponMessage.value = "";
}

function onSubmitOrder(form: CheckoutForm): void {
  orderPlacedFor.value = form.name;
  checkingOut.value = false;
  couponMessage.value = "";
  cart.clear();
}
</script>

<template>
  <main class="layout">
    <section class="layout__products">
      <h1>Mini Shop</h1>

      <SearchBar v-model="keyword" />

      <div class="filters">
        <select v-model="category" aria-label="分类">
          <option value="all">全部分类</option>
          <option v-for="(label, key) in CATEGORY_LABELS" :key="key" :value="key">{{ label }}</option>
        </select>
        <select v-model="sort" aria-label="排序">
          <option value="newest">最新上架</option>
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
          <option value="rating">评分最高</option>
        </select>
        <label><input v-model="inStockOnly" type="checkbox" /> 只看有货</label>
        <button v-if="isFiltering" type="button" @click="reset">清空筛选</button>
      </div>

      <ProductList :products="pageItems" @add="cart.add($event)" />
      <Pagination :page="page" :total-pages="totalPages" @update:page="goTo" />
    </section>

    <aside class="layout__cart">
      <h2>购物车</h2>

      <p v-if="orderPlacedFor" class="notice">下单成功，感谢 {{ orderPlacedFor }} 的购买！</p>

      <CheckoutFormView v-if="checkingOut" @submit="onSubmitOrder" @cancel="checkingOut = false" />

      <template v-else>
        <EmptyState v-if="cart.items.value.length === 0" title="购物车是空的" />
        <ul v-else class="cart-list">
          <CartItem
            v-for="item in cart.items.value"
            :key="item.product.id"
            :item="item"
            @update:quantity="cart.setQuantity"
            @remove="cart.remove"
          />
        </ul>

        <CouponInput
          :applied-code="cart.coupon.value?.code ?? null"
          :message="couponMessage"
          :is-error="couponIsError"
          @apply="onApplyCoupon"
          @remove="onRemoveCoupon"
        />

        <CartSummary
          :count="cart.count.value"
          :subtotal="cart.subtotal.value"
          :discount="cart.discount.value"
          :shipping="cart.shipping.value"
          :total="cart.total.value"
          @checkout="((checkingOut = true), (orderPlacedFor = null))"
        />
      </template>
    </aside>
  </main>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: system-ui, sans-serif;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 12px 0;
}
.layout__cart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cart-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.notice {
  padding: 8px 12px;
  border-radius: 6px;
  background: #dcfce7;
  color: #166534;
}
</style>
