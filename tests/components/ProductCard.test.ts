import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProductCard from "../../src/components/ProductCard.vue";
import type { Product } from "../../src/types";

const base: Product = {
  id: 7,
  name: "降噪耳机",
  category: "electronics",
  price: 129900,
  stock: 8,
  rating: 4.8,
  createdAt: "2026-05-21T08:00:00Z",
  tags: ["音频"],
};

describe("ProductCard", () => {
  it("显示名称、价格、评分和库存", () => {
    const wrapper = mount(ProductCard, { props: { product: base } });

    expect(wrapper.get('[data-test="product-name"]').text()).toBe("降噪耳机");
    expect(wrapper.get('[data-test="product-price"]').text()).toBe("¥1,299.00");
    expect(wrapper.get('[data-test="product-rating"]').text()).toBe("评分 4.8");
    expect(wrapper.get('[data-test="product-stock"]').text()).toBe("有货");
    expect(wrapper.text()).toContain("数码");
  });

  it("库存紧张时显示剩余件数", () => {
    const wrapper = mount(ProductCard, { props: { product: { ...base, stock: 2 } } });
    expect(wrapper.get('[data-test="product-stock"]').text()).toBe("仅剩 2 件");
  });

  it("点击按钮时触发 add 事件并带上商品 id", async () => {
    const wrapper = mount(ProductCard, { props: { product: base } });
    await wrapper.get('[data-test="add-button"]').trigger("click");

    expect(wrapper.emitted("add")).toEqual([[7]]);
  });

  it("缺货时按钮禁用并显示已售罄", async () => {
    const wrapper = mount(ProductCard, { props: { product: { ...base, stock: 0 } } });
    const button = wrapper.get('[data-test="add-button"]');

    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toBe("已售罄");
    expect(wrapper.classes()).toContain("card--sold-out");

    await button.trigger("click");
    expect(wrapper.emitted("add")).toBeUndefined();
  });
});
