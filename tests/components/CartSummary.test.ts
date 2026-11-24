import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CartSummary from "../../src/components/CartSummary.vue";

const props = { count: 2, subtotal: 13800, discount: 1380, shipping: 0, total: 12420 };

describe("CartSummary", () => {
  it("显示各项金额", () => {
    const wrapper = mount(CartSummary, { props });

    expect(wrapper.text()).toContain("小计（2 件）");
    expect(wrapper.get('[data-test="subtotal"]').text()).toBe("¥138.00");
    expect(wrapper.get('[data-test="discount"]').text()).toBe("-¥13.80");
    expect(wrapper.get('[data-test="total"]').text()).toBe("¥124.20");
  });

  it("没有优惠时不显示优惠这一行", () => {
    const wrapper = mount(CartSummary, { props: { ...props, discount: 0 } });
    expect(wrapper.find('[data-test="discount"]').exists()).toBe(false);
  });

  it("运费为 0 时显示免运费，否则显示金额", () => {
    const free = mount(CartSummary, { props });
    expect(free.get('[data-test="shipping"]').text()).toBe("免运费");

    const paid = mount(CartSummary, { props: { ...props, shipping: 800 } });
    expect(paid.get('[data-test="shipping"]').text()).toBe("¥8.00");
  });

  it("点击去结算时触发 checkout 事件", async () => {
    const wrapper = mount(CartSummary, { props });
    await wrapper.get('[data-test="checkout-button"]').trigger("click");

    expect(wrapper.emitted("checkout")).toHaveLength(1);
  });

  it("购物车为空时禁用结算按钮", () => {
    const wrapper = mount(CartSummary, { props: { count: 0, subtotal: 0, discount: 0, shipping: 0, total: 0 } });
    expect(wrapper.get('[data-test="checkout-button"]').attributes("disabled")).toBeDefined();
  });
});
