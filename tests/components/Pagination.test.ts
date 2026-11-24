import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Pagination from "../../src/components/Pagination.vue";

describe("Pagination", () => {
  it("只有一页时不渲染", () => {
    const wrapper = mount(Pagination, { props: { page: 1, totalPages: 1 } });
    expect(wrapper.find('[data-test="pagination"]').exists()).toBe(false);
  });

  it("渲染页码和省略号，并标记当前页", () => {
    const wrapper = mount(Pagination, { props: { page: 5, totalPages: 10 } });

    expect(wrapper.findAll('[data-test="page-number"]').map((b) => b.text())).toEqual(["1", "4", "5", "6", "10"]);
    expect(wrapper.findAll('[data-test="page-gap"]')).toHaveLength(2);

    const active = wrapper.get(".is-active");
    expect(active.text()).toBe("5");
    expect(active.attributes("aria-current")).toBe("page");
  });

  it("点击页码时触发 update:page", async () => {
    const wrapper = mount(Pagination, { props: { page: 1, totalPages: 3 } });
    await wrapper.findAll('[data-test="page-number"]')[2].trigger("click");

    expect(wrapper.emitted("update:page")).toEqual([[3]]);
  });

  it("点击当前页不触发事件", async () => {
    const wrapper = mount(Pagination, { props: { page: 2, totalPages: 3 } });
    await wrapper.findAll('[data-test="page-number"]')[1].trigger("click");

    expect(wrapper.emitted("update:page")).toBeUndefined();
  });

  it("上一页和下一页按钮", async () => {
    const wrapper = mount(Pagination, { props: { page: 2, totalPages: 3 } });
    await wrapper.get('[data-test="page-prev"]').trigger("click");
    await wrapper.get('[data-test="page-next"]').trigger("click");

    expect(wrapper.emitted("update:page")).toEqual([[1], [3]]);
  });

  it("在第一页和最后一页时禁用对应的按钮", () => {
    const first = mount(Pagination, { props: { page: 1, totalPages: 3 } });
    expect(first.get('[data-test="page-prev"]').attributes("disabled")).toBeDefined();
    expect(first.get('[data-test="page-next"]').attributes("disabled")).toBeUndefined();

    const last = mount(Pagination, { props: { page: 3, totalPages: 3 } });
    expect(last.get('[data-test="page-prev"]').attributes("disabled")).toBeUndefined();
    expect(last.get('[data-test="page-next"]').attributes("disabled")).toBeDefined();
  });
});
