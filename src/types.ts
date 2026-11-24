export type Category = "book" | "electronics" | "clothing" | "food";

export interface Product {
  id: number;
  name: string;
  category: Category;
  /** 价格，单位是"分"。所有金额都用整数分来计算，只在显示时才转成元 */
  price: number;
  stock: number;
  /** 评分，0 到 5 */
  rating: number;
  /** 上架时间，ISO 字符串 */
  createdAt: string;
  tags: string[];
}

export interface CartLine {
  productId: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  /** percent：按百分比打折；fixed：直接减去固定金额（分） */
  type: "percent" | "fixed";
  value: number;
  /** 最低消费金额（分），小计达到才能使用 */
  minSpend: number;
  /** 过期时间，ISO 字符串。不填表示永久有效 */
  expiresAt?: string;
}

export type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}
