<script setup lang="ts">
import { reactive, ref } from "vue";
import type { CheckoutForm } from "../types";
import { hasErrors, validateCheckout, type CheckoutErrors } from "../utils/validate";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits<{
  submit: [form: CheckoutForm];
  cancel: [];
}>();

const form = reactive<CheckoutForm>({ name: "", email: "", phone: "", address: "" });
const errors = ref<CheckoutErrors>({});

const fields: { key: keyof CheckoutForm; label: string; type: string }[] = [
  { key: "name", label: "收货人", type: "text" },
  { key: "email", label: "邮箱", type: "email" },
  { key: "phone", label: "手机号", type: "tel" },
  { key: "address", label: "收货地址", type: "text" },
];

function onSubmit(): void {
  errors.value = validateCheckout(form);
  if (hasErrors(errors.value)) return;

  // 提交的是去掉首尾空格后的副本，不把内部的响应式对象直接交出去
  emit("submit", {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.replace(/[\s-]/g, ""),
    address: form.address.trim(),
  });
}
</script>

<template>
  <form class="checkout" novalidate data-test="checkout-form" @submit.prevent="onSubmit">
    <label v-for="field in fields" :key="field.key" class="checkout__field">
      <span>{{ field.label }}</span>
      <input v-model="form[field.key]" :type="field.type" :data-test="`field-${field.key}`" :aria-invalid="Boolean(errors[field.key])" />
      <span v-if="errors[field.key]" class="checkout__error" :data-test="`error-${field.key}`">{{ errors[field.key] }}</span>
    </label>

    <div class="checkout__actions">
      <BaseButton variant="secondary" data-test="checkout-cancel" @click="emit('cancel')">返回</BaseButton>
      <BaseButton type="submit" data-test="checkout-submit">提交订单</BaseButton>
    </div>
  </form>
</template>

<style scoped>
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.checkout__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.checkout__field input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.checkout__error {
  font-size: 12px;
  color: #b91c1c;
}
.checkout__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
