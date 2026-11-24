import type { Coupon } from "../types";

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, minSpend: 0 },
  { code: "SAVE20", type: "fixed", value: 2000, minSpend: 10000 },
  { code: "VIP15", type: "percent", value: 15, minSpend: 20000 },
  { code: "SPRING5", type: "fixed", value: 500, minSpend: 3000, expiresAt: "2026-06-30T23:59:59Z" },
];

/** 满这个金额（分）免运费，按优惠后的金额计算 */
export const FREE_SHIPPING_THRESHOLD = 9900;
/** 运费（分） */
export const SHIPPING_FEE = 800;

/** 按优惠码查找优惠券，忽略大小写和首尾空格 */
export function findCoupon(code: string, coupons: Coupon[] = COUPONS): Coupon | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return coupons.find((coupon) => coupon.code === normalized) ?? null;
}

export type CouponCheck = { ok: true } | { ok: false; reason: string };

/** 检查优惠券在当前小计和时间下能不能用 */
export function checkCoupon(coupon: Coupon, subtotal: number, now: Date = new Date()): CouponCheck {
  if (coupon.expiresAt && now.getTime() > new Date(coupon.expiresAt).getTime()) {
    return { ok: false, reason: "优惠券已过期" };
  }
  if (subtotal < coupon.minSpend) {
    return { ok: false, reason: `订单满 ¥${(coupon.minSpend / 100).toFixed(2)} 才能使用` };
  }
  return { ok: true };
}

/**
 * 计算优惠金额（分）。
 * 百分比券四舍五入到分；固定金额券最多减到 0，不会让订单变成负数。
 * 这里只负责计算，不检查能不能用，调用前应先用 checkCoupon 判断。
 */
export function calcDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon || subtotal <= 0) return 0;
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotal);
}

/** 计算运费（分）。amount 是优惠后的金额；空订单不收运费 */
export function calcShipping(amount: number): number {
  if (amount <= 0) return 0;
  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
