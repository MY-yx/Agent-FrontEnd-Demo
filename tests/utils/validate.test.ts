import { describe, expect, it } from "vitest";
import type { CheckoutForm } from "../../src/types";
import { hasErrors, isEmail, isPhone, validateCheckout } from "../../src/utils/validate";

describe("isEmail", () => {
  it("接受常见的邮箱格式", () => {
    expect(isEmail("user@example.com")).toBe(true);
    expect(isEmail("  first.last+tag@sub.example.co  ")).toBe(true);
  });

  it("拒绝不完整的邮箱", () => {
    expect(isEmail("user@")).toBe(false);
    expect(isEmail("user@example")).toBe(false);
    expect(isEmail("user example@test.com")).toBe(false);
    expect(isEmail("")).toBe(false);
  });
});

describe("isPhone", () => {
  it("接受 11 位大陆手机号，允许空格和短横线", () => {
    expect(isPhone("13800138000")).toBe(true);
    expect(isPhone("138-0013-8000")).toBe(true);
    expect(isPhone("138 0013 8000")).toBe(true);
  });

  it("拒绝位数或号段不对的号码", () => {
    expect(isPhone("1380013800")).toBe(false);
    expect(isPhone("12800138000")).toBe(false);
    expect(isPhone("23800138000")).toBe(false);
  });
});

describe("validateCheckout", () => {
  const valid: CheckoutForm = {
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    address: "北京市朝阳区某某路 1 号",
  };

  it("全部合法时没有错误", () => {
    const errors = validateCheckout(valid);
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it("全部为空时每个字段都有提示", () => {
    const errors = validateCheckout({ name: "", email: " ", phone: "", address: "" });
    expect(Object.keys(errors).sort()).toEqual(["address", "email", "name", "phone"]);
    expect(hasErrors(errors)).toBe(true);
  });

  it("区分没填和格式不对两种情况", () => {
    expect(validateCheckout({ ...valid, email: "" }).email).toBe("请填写邮箱");
    expect(validateCheckout({ ...valid, email: "abc" }).email).toBe("邮箱格式不正确");
    expect(validateCheckout({ ...valid, phone: "123" }).phone).toBe("手机号格式不正确");
  });

  it("检查姓名和地址的长度", () => {
    expect(validateCheckout({ ...valid, name: "张" }).name).toBe("姓名长度应为 2 到 20 个字符");
    expect(validateCheckout({ ...valid, name: "a".repeat(21) }).name).toBe("姓名长度应为 2 到 20 个字符");
    expect(validateCheckout({ ...valid, address: "北京" }).address).toBe("收货地址至少 5 个字符");
  });
});
