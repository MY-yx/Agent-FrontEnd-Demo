<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

defineProps<{
  /** 当前已使用的优惠码，没有则为 null */
  appliedCode: string | null;
  /** 上一次操作的提示信息 */
  message?: string;
  /** 提示信息是否为错误 */
  isError?: boolean;
}>();

const emit = defineEmits<{
  apply: [code: string];
  remove: [];
}>();

const code = ref("");

function submit(): void {
  const value = code.value.trim();
  if (!value) return;
  emit("apply", value);
  code.value = "";
}
</script>

<template>
  <div class="coupon">
    <div v-if="appliedCode" class="coupon__applied" data-test="coupon-applied">
      <span>已使用：{{ appliedCode }}</span>
      <button type="button" data-test="coupon-remove" @click="emit('remove')">取消使用</button>
    </div>

    <form v-else class="coupon__form" @submit.prevent="submit">
      <input v-model="code" data-test="coupon-input" placeholder="输入优惠码" />
      <BaseButton type="submit" variant="secondary" data-test="coupon-apply">使用</BaseButton>
    </form>

    <p v-if="message" class="coupon__message" :class="{ 'is-error': isError }" data-test="coupon-message">
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.coupon__form {
  display: flex;
  gap: 8px;
}
.coupon__form input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.coupon__applied {
  display: flex;
  justify-content: space-between;
  color: #15803d;
}
.coupon__applied button {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}
.coupon__message {
  margin: 6px 0 0;
  font-size: 12px;
  color: #15803d;
}
.coupon__message.is-error {
  color: #b91c1c;
}
</style>
