<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    type?: "button" | "submit";
  }>(),
  { variant: "primary", disabled: false, type: "button" },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button :type="type" class="btn" :class="`btn--${variant}`" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  padding: 6px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn--primary {
  background: #2563eb;
  color: #fff;
}
.btn--secondary {
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
}
.btn--danger {
  background: #fff;
  border-color: #fca5a5;
  color: #b91c1c;
}
</style>
