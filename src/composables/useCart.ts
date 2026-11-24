import { computed, ref } from "vue";
import { PRODUCTS } from "../data/products";
import type { CartLine, Coupon, Product } from "../types";
import { sum } from "../utils/array";
import { calcDiscount, calcShipping, checkCoupon, findCoupon } from "../utils/discount";

/** 购物车里的一行，已经关联上商品信息 */
export interface CartItemView {
  product: Product;
  quantity: number;
  /** 这一行的金额（分）= 单价 × 数量 */
  lineTotal: number;
}

export interface CouponResult {
  ok: boolean;
  message: string;
}

/**
 * 创建一个购物车。
 * @param catalog 商品目录，用来查价格和库存
 * @param now 获取当前时间的函数，测试时可以替换，用于判断优惠券是否过期
 */
export function createCart(catalog: Product[], now: () => Date = () => new Date()) {
  const lines = ref<CartLine[]>([]);
  const coupon = ref<Coupon | null>(null);

  const productById = new Map(catalog.map((product) => [product.id, product]));

  const items = computed<CartItemView[]>(() =>
    lines.value.flatMap((line) => {
      const product = productById.get(line.productId);
      if (!product) return [];
      return [{ product, quantity: line.quantity, lineTotal: product.price * line.quantity }];
    }),
  );

  /** 商品总件数 */
  const count = computed(() => sum(lines.value.map((line) => line.quantity)));

  /** 小计：优惠和运费之前的金额 */
  const subtotal = computed(() => sum(items.value.map((item) => item.lineTotal)));

  /** 优惠金额。优惠券不满足条件时（例如删了商品后小计不够了）为 0，但优惠券仍然保留 */
  const discount = computed(() => {
    if (!coupon.value) return 0;
    if (!checkCoupon(coupon.value, subtotal.value, now()).ok) return 0;
    return calcDiscount(coupon.value, subtotal.value);
  });

  /** 运费，按优惠后的金额判断是否免运费 */
  const shipping = computed(() => calcShipping(subtotal.value - discount.value));

  const total = computed(() => subtotal.value - discount.value + shipping.value);

  /** 加入购物车。商品不存在、数量不合法或超过库存时返回 false，购物车不变 */
  function add(productId: number, quantity = 1): boolean {
    const product = productById.get(productId);
    if (!product || !Number.isInteger(quantity) || quantity <= 0) return false;

    const existing = lines.value.find((line) => line.productId === productId);
    const next = (existing?.quantity ?? 0) + quantity;
    if (next > product.stock) return false;

    if (existing) existing.quantity = next;
    else lines.value.push({ productId, quantity });
    return true;
  }

  /** 直接设置数量。设为 0 或负数等同于移除；超过库存时返回 false，数量不变 */
  function setQuantity(productId: number, quantity: number): boolean {
    const product = productById.get(productId);
    const existing = lines.value.find((line) => line.productId === productId);
    if (!product || !existing || !Number.isInteger(quantity)) return false;

    if (quantity <= 0) {
      remove(productId);
      return true;
    }
    if (quantity > product.stock) return false;

    existing.quantity = quantity;
    return true;
  }

  function remove(productId: number): void {
    lines.value = lines.value.filter((line) => line.productId !== productId);
  }

  /** 清空购物车，同时移除优惠券 */
  function clear(): void {
    lines.value = [];
    coupon.value = null;
  }

  /** 使用优惠码。无效或不满足条件时不会替换已有的优惠券 */
  function applyCoupon(code: string): CouponResult {
    const found = findCoupon(code);
    if (!found) return { ok: false, message: "优惠码无效" };

    const check = checkCoupon(found, subtotal.value, now());
    if (!check.ok) return { ok: false, message: check.reason };

    coupon.value = found;
    return { ok: true, message: `已使用优惠码 ${found.code}` };
  }

  function removeCoupon(): void {
    coupon.value = null;
  }

  return {
    lines,
    coupon,
    items,
    count,
    subtotal,
    discount,
    shipping,
    total,
    add,
    setQuantity,
    remove,
    clear,
    applyCoupon,
    removeCoupon,
  };
}

export type Cart = ReturnType<typeof createCart>;

let sharedCart: Cart | undefined;

/** 全局共享的购物车，整个应用用同一个 */
export function useCart(): Cart {
  sharedCart ??= createCart(PRODUCTS);
  return sharedCart;
}
