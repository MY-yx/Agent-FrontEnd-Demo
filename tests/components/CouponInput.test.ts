import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CouponInput from "../../src/components/CouponInput.vue";

describe("CouponInput", () => {
  it("提交时触发 apply 事件，去掉首尾空格并清空输入框", async () => {
    const wrapper = mount(CouponInput, { props: { appliedCode: null } });
    const input = wrapper.get('[data-test="coupon-input"]');

    await input.setValue("  SAVE20 ");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("apply")).toEqual([["SAVE20"]]);
    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("输入为空时不触发事件", async () => {
    const wrapper = mount(CouponInput, { props: { appliedCode: null } });
    await wrapper.get('[data-test="coupon-input"]').setValue("   ");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("apply")).toBeUndefined();
  });

  it("已使用优惠码时显示优惠码和取消按钮，不显示输入框", async () => {
    const wrapper = mount(CouponInput, { props: { appliedCode: "SAVE20" } });

    expect(wrapper.get('[data-test="coupon-applied"]').text()).toContain("SAVE20");
    expect(wrapper.find('[data-test="coupon-input"]').exists()).toBe(false);

    await wrapper.get('[data-test="coupon-remove"]').trigger("click");
    expect(wrapper.emitted("remove")).toHaveLength(1);
  });

  it("显示提示信息，并区分成功和错误", () => {
    const success = mount(CouponInput, { props: { appliedCode: "SAVE20", message: "已使用优惠码 SAVE20" } });
    const successMessage = success.get('[data-test="coupon-message"]');
    expect(successMessage.text()).toBe("已使用优惠码 SAVE20");
    expect(successMessage.classes()).not.toContain("is-error");

    const error = mount(CouponInput, { props: { appliedCode: null, message: "优惠码无效", isError: true } });
    expect(error.get('[data-test="coupon-message"]').classes()).toContain("is-error");
  });

  it("没有提示信息时不渲染提示", () => {
    const wrapper = mount(CouponInput, { props: { appliedCode: null } });
    expect(wrapper.find('[data-test="coupon-message"]').exists()).toBe(false);
  });
});
