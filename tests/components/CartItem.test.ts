import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CartItem from "../../src/components/CartItem.vue";
import type { CartItemView } from "../../src/composables/useCart";

function makeItem(quantity: number, stock = 3): CartItemView {
  return {
    product: { id: 1, name: "TypeScript 编程入门", category: "book", price: 6900, stock, rating: 4.6, createdAt: "2026-01-12T08:00:00Z", tags: [] },
    quantity,
    lineTotal: 6900 * quantity,
  };
}

describe("CartItem", () => {
  it("显示名称、数量和行金额", () => {
    const wrapper = mount(CartItem, { props: { item: makeItem(2) } });

    expect(wrapper.get('[data-test="item-name"]').text()).toBe("TypeScript 编程入门");
    expect(wrapper.get('[data-test="quantity"]').text()).toBe("2");
    expect(wrapper.get('[data-test="line-total"]').text()).toBe("¥138.00");
  });

  it("点击加减按钮时带上商品 id 和新的数量", async () => {
    const wrapper = mount(CartItem, { props: { item: makeItem(2) } });
    await wrapper.get('[data-test="increase"]').trigger("click");
    await wrapper.get('[data-test="decrease"]').trigger("click");

    expect(wrapper.emitted("update:quantity")).toEqual([
      [1, 3],
      [1, 1],
    ]);
  });

  it("数量为 1 时仍然可以减少，由上层决定是否移除", async () => {
    const wrapper = mount(CartItem, { props: { item: makeItem(1) } });
    await wrapper.get('[data-test="decrease"]').trigger("click");

    expect(wrapper.emitted("update:quantity")).toEqual([[1, 0]]);
  });

  it("达到库存上限时禁用加号", () => {
    const wrapper = mount(CartItem, { props: { item: makeItem(3, 3) } });
    expect(wrapper.get('[data-test="increase"]').attributes("disabled")).toBeDefined();
  });

  it("点击移除时触发 remove 事件", async () => {
    const wrapper = mount(CartItem, { props: { item: makeItem(2) } });
    await wrapper.get('[data-test="remove"]').trigger("click");

    expect(wrapper.emitted("remove")).toEqual([[1]]);
  });
});
