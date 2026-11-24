import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SearchBar from "../../src/components/SearchBar.vue";

describe("SearchBar", () => {
  it("显示传入的值和默认占位文字", () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "键盘" } });
    const input = wrapper.get('[data-test="search-input"]');

    expect((input.element as HTMLInputElement).value).toBe("键盘");
    expect(input.attributes("placeholder")).toBe("搜索商品名称或标签");
  });

  it("输入时触发 update:modelValue", async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "" } });
    await wrapper.get('[data-test="search-input"]').setValue("vue");

    expect(wrapper.emitted("update:modelValue")).toEqual([["vue"]]);
  });

  it("有内容时显示清除按钮，点击后清空", async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "vue" } });
    await wrapper.get('[data-test="search-clear"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[""]]);
  });

  it("没有内容时不显示清除按钮", () => {
    const wrapper = mount(SearchBar, { props: { modelValue: "" } });
    expect(wrapper.find('[data-test="search-clear"]').exists()).toBe(false);
  });
});
