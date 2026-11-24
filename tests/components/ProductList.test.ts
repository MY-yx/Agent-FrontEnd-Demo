import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProductList from "../../src/components/ProductList.vue";
import { PRODUCTS } from "../../src/data/products";

describe("ProductList", () => {
  it("为每个商品渲染一张卡片", () => {
    const wrapper = mount(ProductList, { props: { products: PRODUCTS.slice(0, 3) } });

    expect(wrapper.findAll('[data-test="product-card"]')).toHaveLength(3);
    expect(wrapper.find('[data-test="empty-state"]').exists()).toBe(false);
  });

  it("没有商品时显示空状态", () => {
    const wrapper = mount(ProductList, { props: { products: [] } });

    expect(wrapper.find('[data-test="product-grid"]').exists()).toBe(false);
    expect(wrapper.get('[data-test="empty-state"]').text()).toContain("没有找到商品");
  });

  it("把卡片的 add 事件向上传递", async () => {
    const wrapper = mount(ProductList, { props: { products: PRODUCTS.slice(0, 2) } });
    await wrapper.findAll('[data-test="add-button"]')[1].trigger("click");

    expect(wrapper.emitted("add")).toEqual([[PRODUCTS[1].id]]);
  });
});
