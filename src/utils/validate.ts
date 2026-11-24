import type { CheckoutForm } from "../types";

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** 中国大陆手机号：1 开头，第二位 3 到 9，共 11 位。允许中间有空格或短横线 */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value.replace(/[\s-]/g, ""));
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

/** 校验结算表单，返回每个出错字段的提示。没有错误时返回空对象 */
export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const name = form.name.trim();
  if (!name) errors.name = "请填写收货人姓名";
  else if (name.length < 2 || name.length > 20) errors.name = "姓名长度应为 2 到 20 个字符";

  if (!form.email.trim()) errors.email = "请填写邮箱";
  else if (!isEmail(form.email)) errors.email = "邮箱格式不正确";

  if (!form.phone.trim()) errors.phone = "请填写手机号";
  else if (!isPhone(form.phone)) errors.phone = "手机号格式不正确";

  const address = form.address.trim();
  if (!address) errors.address = "请填写收货地址";
  else if (address.length < 5) errors.address = "收货地址至少 5 个字符";

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}
