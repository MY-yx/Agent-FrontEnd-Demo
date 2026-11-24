import { describe, expect, it } from "vitest";
import type { Coupon } from "../../src/types";
import { calcDiscount, calcShipping, checkCoupon, findCoupon, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../../src/utils/discount";

const percent10: Coupon = { code: "P10", type: "percent", value: 10, minSpend: 0 };
const fixed20: Coupon = { code: "F20", type: "fixed", value: 2000, minSpend: 10000 };
const expiring: Coupon = { code: "EXP", type: "fixed", value: 500, minSpend: 0, expiresAt: "2026-06-30T23:59:59Z" };

describe("findCoupon", () => {
  it("忽略大小写和首尾空格", () => {
    expect(findCoupon("welcome10")?.code).toBe("WELCOME10");
    expect(findCoupon("  Save20 ")?.code).toBe("SAVE20");
  });

  it("找不到或为空时返回 null", () => {
    expect(findCoupon("NOPE")).toBeNull();
    expect(findCoupon("   ")).toBeNull();
  });
});

describe("checkCoupon", () => {
  it("满足条件时可用", () => {
    expect(checkCoupon(percent10, 100)).toEqual({ ok: true });
    expect(checkCoupon(fixed20, 10000)).toEqual({ ok: true });
  });

  it("没达到最低消费时不可用，并说明原因", () => {
    expect(checkCoupon(fixed20, 9999)).toEqual({ ok: false, reason: "订单满 ¥100.00 才能使用" });
  });

  it("过期后不可用", () => {
    expect(checkCoupon(expiring, 1000, new Date("2026-06-30T12:00:00Z"))).toEqual({ ok: true });
    expect(checkCoupon(expiring, 1000, new Date("2026-07-01T00:00:00Z"))).toEqual({ ok: false, reason: "优惠券已过期" });
  });
});

describe("calcDiscount", () => {
  it("百分比券按比例计算并四舍五入到分", () => {
    expect(calcDiscount(percent10, 6900)).toBe(690);
    expect(calcDiscount(percent10, 3335)).toBe(334);
  });

  it("固定金额券直接减去面值", () => {
    expect(calcDiscount(fixed20, 15000)).toBe(2000);
  });

  it("固定金额券不会超过小计", () => {
    expect(calcDiscount({ ...fixed20, minSpend: 0 }, 1500)).toBe(1500);
  });

  it("没有优惠券或小计为 0 时没有优惠", () => {
    expect(calcDiscount(null, 5000)).toBe(0);
    expect(calcDiscount(percent10, 0)).toBe(0);
  });
});

describe("calcShipping", () => {
  it("达到门槛免运费", () => {
    expect(calcShipping(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(calcShipping(FREE_SHIPPING_THRESHOLD + 1)).toBe(0);
  });

  it("没达到门槛收运费", () => {
    expect(calcShipping(FREE_SHIPPING_THRESHOLD - 1)).toBe(SHIPPING_FEE);
  });

  it("空订单不收运费", () => {
    expect(calcShipping(0)).toBe(0);
  });
});
