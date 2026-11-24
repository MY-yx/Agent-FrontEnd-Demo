import { ref, watch, type Ref } from "vue";

/**
 * 和 localStorage 同步的 ref。
 * 读取失败（没有值、JSON 损坏、存储不可用）时使用 initial；写入失败时静默忽略。
 */
export function useLocalStorage<T>(key: string, initial: T): Ref<T> {
  const state = ref(read(key, initial)) as Ref<T>;

  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // 存储已满或被禁用时不影响页面使用
      }
    },
    { deep: true },
  );

  return state;
}

function read<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    return initial;
  }
}
