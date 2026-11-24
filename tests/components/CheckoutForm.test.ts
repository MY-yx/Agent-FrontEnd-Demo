import { mount, type VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CheckoutForm from "../../src/components/CheckoutForm.vue";

async function fill(wrapper: VueWrapper, values: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    await wrapper.get(`[data-test="field-${key}"]`).setValue(value);
  }
}

const valid = {
  name: "张三",
  email: "zhangsan@example.com",
  phone: "13800138000",
  address: "北京市朝阳区某某路 1 号",
};

describe("CheckoutForm", () => {
  it("填写合法时提交表单内容", async () => {
    const wrapper = mount(CheckoutForm);
    await fill(wrapper, valid);
    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("submit")).toEqual([[valid]]);
  });

  it("提交前去掉首尾空格，并去掉手机号里的分隔符", async () => {
    const wrapper = mount(CheckoutForm);
    await fill(wrapper, { ...valid, name: "  张三 ", phone: "138-0013-8000" });
    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("submit")).toEqual([[valid]]);
  });

  it("为空时显示每个字段的错误，并且不提交", async () => {
    const wrapper = mount(CheckoutForm);
    await wrapper.get("form").trigger("submit");

    expect(wrapper.get('[data-test="error-name"]').text()).toBe("请填写收货人姓名");
    expect(wrapper.get('[data-test="error-email"]').text()).toBe("请填写邮箱");
    expect(wrapper.get('[data-test="error-phone"]').text()).toBe("请填写手机号");
    expect(wrapper.get('[data-test="error-address"]').text()).toBe("请填写收货地址");
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("只对出错的字段显示错误，并标记 aria-invalid", async () => {
    const wrapper = mount(CheckoutForm);
    await fill(wrapper, { ...valid, email: "abc" });
    await wrapper.get("form").trigger("submit");

    expect(wrapper.get('[data-test="error-email"]').text()).toBe("邮箱格式不正确");
    expect(wrapper.find('[data-test="error-name"]').exists()).toBe(false);
    expect(wrapper.get('[data-test="field-email"]').attributes("aria-invalid")).toBe("true");
    expect(wrapper.get('[data-test="field-name"]').attributes("aria-invalid")).toBe("false");
  });

  it("修正后重新提交，错误消失", async () => {
    const wrapper = mount(CheckoutForm);
    await fill(wrapper, { ...valid, email: "abc" });
    await wrapper.get("form").trigger("submit");
    expect(wrapper.find('[data-test="error-email"]').exists()).toBe(true);

    await fill(wrapper, { email: valid.email });
    await wrapper.get("form").trigger("submit");

    expect(wrapper.find('[data-test="error-email"]').exists()).toBe(false);
    expect(wrapper.emitted("submit")).toHaveLength(1);
  });

  it("点击返回时触发 cancel 事件", async () => {
    const wrapper = mount(CheckoutForm);
    await wrapper.get('[data-test="checkout-cancel"]').trigger("click");

    expect(wrapper.emitted("cancel")).toHaveLength(1);
    expect(wrapper.emitted("submit")).toBeUndefined();
  });
});
