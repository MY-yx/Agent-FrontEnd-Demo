import { describe, expect, it } from "vitest";
import { createCart } from "../../src/composables/useCart";
import type { Product } from "../../src/types";

const catalog: Product[] = [
  { id: 1, name: "书", category: "book", price: 5000, stock: 3, rating: 4, createdAt: "2026-01-01T00:00:00Z", tags: [] },
  { id: 2, name: "键盘", category: "electronics", price: 30000, stock: 10, rating: 4, createdAt: "2026-01-01T00:00:00Z", tags: [] },
  { id: 3, name: "缺货品", category: "food", price: 1000, stock: 0, rating: 4, createdAt: "2026-01-01T00:00:00Z", tags: [] },
];

const fixedNow = () => new Date("2026-05-01T00:00:00Z");

describe("加入和修改商品", () => {
  it("加入商品后更新件数和小计", () => {
    const cart = createCart(catalog, fixedNow);
    expect(cart.add(1)).toBe(true);
    expect(cart.add(2, 2)).toBe(true);

    expect(cart.count.value).toBe(3);
    expect(cart.subtotal.value).toBe(5000 + 60000);
    expect(cart.items.value.map((item) => item.lineTotal)).toEqual([5000, 60000]);
  });

  it("重复加入同一商品会合并成一行", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);
    cart.add(1, 2);

    expect(cart.lines.value).toEqual([{ productId: 1, quantity: 3 }]);
  });

  it("超过库存时拒绝，购物车不变", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1, 2);

    expect(cart.add(1, 2)).toBe(false);
    expect(cart.add(3)).toBe(false);
    expect(cart.lines.value).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it("拒绝不存在的商品和不合法的数量", () => {
    const cart = createCart(catalog, fixedNow);
    expect(cart.add(999)).toBe(false);
    expect(cart.add(1, 0)).toBe(false);
    expect(cart.add(1, -1)).toBe(false);
    expect(cart.add(1, 1.5)).toBe(false);
    expect(cart.count.value).toBe(0);
  });

  it("setQuantity 直接设置数量，受库存限制", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);

    expect(cart.setQuantity(1, 3)).toBe(true);
    expect(cart.count.value).toBe(3);
    expect(cart.setQuantity(1, 4)).toBe(false);
    expect(cart.count.value).toBe(3);
  });

  it("setQuantity 设为 0 时移除该商品", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);
    cart.add(2);

    expect(cart.setQuantity(1, 0)).toBe(true);
    expect(cart.lines.value).toEqual([{ productId: 2, quantity: 1 }]);
  });

  it("setQuantity 对不在购物车里的商品返回 false", () => {
    const cart = createCart(catalog, fixedNow);
    expect(cart.setQuantity(1, 2)).toBe(false);
  });

  it("remove 移除商品，clear 清空购物车和优惠券", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);
    cart.add(2);
    cart.applyCoupon("WELCOME10");

    cart.remove(1);
    expect(cart.lines.value).toEqual([{ productId: 2, quantity: 1 }]);

    cart.clear();
    expect(cart.lines.value).toEqual([]);
    expect(cart.coupon.value).toBeNull();
    expect(cart.total.value).toBe(0);
  });
});

describe("运费", () => {
  it("没达到免运费门槛时收运费", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);

    expect(cart.shipping.value).toBe(800);
    expect(cart.total.value).toBe(5800);
  });

  it("达到门槛后免运费", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1, 2);

    expect(cart.subtotal.value).toBe(10000);
    expect(cart.shipping.value).toBe(0);
    expect(cart.total.value).toBe(10000);
  });

  it("按优惠后的金额判断是否免运费", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1, 2);
    cart.applyCoupon("WELCOME10");

    // 小计 10000，打九折后 9000，低于 9900 的门槛，所以要收运费
    expect(cart.discount.value).toBe(1000);
    expect(cart.shipping.value).toBe(800);
    expect(cart.total.value).toBe(9800);
  });

  it("空购物车没有运费", () => {
    const cart = createCart(catalog, fixedNow);
    expect(cart.shipping.value).toBe(0);
    expect(cart.total.value).toBe(0);
  });
});

describe("优惠券", () => {
  it("使用成功后计算优惠", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(2);

    expect(cart.applyCoupon("save20")).toEqual({ ok: true, message: "已使用优惠码 SAVE20" });
    expect(cart.discount.value).toBe(2000);
    expect(cart.total.value).toBe(28000);
  });

  it("优惠码无效时给出提示", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);

    expect(cart.applyCoupon("NOPE")).toEqual({ ok: false, message: "优惠码无效" });
    expect(cart.coupon.value).toBeNull();
  });

  it("没达到最低消费时拒绝，并且不替换已有的优惠券", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(1);
    cart.applyCoupon("WELCOME10");

    const result = cart.applyCoupon("SAVE20");
    expect(result.ok).toBe(false);
    expect(result.message).toBe("订单满 ¥100.00 才能使用");
    expect(cart.coupon.value?.code).toBe("WELCOME10");
  });

  it("过期的优惠券不能使用", () => {
    const cart = createCart(catalog, () => new Date("2026-08-01T00:00:00Z"));
    cart.add(1);

    expect(cart.applyCoupon("SPRING5")).toEqual({ ok: false, message: "优惠券已过期" });
  });

  it("删减商品导致不满足条件时优惠变为 0，但优惠券保留", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(2);
    cart.add(1);
    cart.applyCoupon("SAVE20");
    expect(cart.discount.value).toBe(2000);

    cart.remove(2);
    expect(cart.subtotal.value).toBe(5000);
    expect(cart.discount.value).toBe(0);
    expect(cart.coupon.value?.code).toBe("SAVE20");

    cart.add(2);
    expect(cart.discount.value).toBe(2000);
  });

  it("removeCoupon 取消使用", () => {
    const cart = createCart(catalog, fixedNow);
    cart.add(2);
    cart.applyCoupon("WELCOME10");
    cart.removeCoupon();

    expect(cart.coupon.value).toBeNull();
    expect(cart.discount.value).toBe(0);
  });
});
