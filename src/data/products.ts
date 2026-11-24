import type { Category, Product } from "../types";

export const CATEGORY_LABELS: Record<Category, string> = {
  book: "图书",
  electronics: "数码",
  clothing: "服饰",
  food: "食品",
};

export const PRODUCTS: Product[] = [
  { id: 1, name: "TypeScript 编程入门", category: "book", price: 6900, stock: 24, rating: 4.6, createdAt: "2026-01-12T08:00:00Z", tags: ["编程", "前端"] },
  { id: 2, name: "Vue 3 设计与实现", category: "book", price: 8900, stock: 3, rating: 4.9, createdAt: "2026-03-02T08:00:00Z", tags: ["编程", "前端", "Vue"] },
  { id: 3, name: "算法图解", category: "book", price: 4900, stock: 0, rating: 4.4, createdAt: "2025-11-20T08:00:00Z", tags: ["编程", "算法"] },
  { id: 4, name: "机械键盘 87 键", category: "electronics", price: 39900, stock: 12, rating: 4.7, createdAt: "2026-02-18T08:00:00Z", tags: ["外设", "键盘"] },
  { id: 5, name: "无线鼠标", category: "electronics", price: 12900, stock: 40, rating: 4.2, createdAt: "2025-12-05T08:00:00Z", tags: ["外设", "鼠标"] },
  { id: 6, name: "USB-C 扩展坞", category: "electronics", price: 25900, stock: 5, rating: 4.0, createdAt: "2026-04-09T08:00:00Z", tags: ["外设", "接口"] },
  { id: 7, name: "降噪耳机", category: "electronics", price: 129900, stock: 8, rating: 4.8, createdAt: "2026-05-21T08:00:00Z", tags: ["音频", "耳机"] },
  { id: 8, name: "纯棉 T 恤", category: "clothing", price: 7900, stock: 60, rating: 4.1, createdAt: "2026-04-28T08:00:00Z", tags: ["夏季", "基础款"] },
  { id: 9, name: "连帽卫衣", category: "clothing", price: 19900, stock: 18, rating: 4.5, createdAt: "2025-10-15T08:00:00Z", tags: ["秋冬", "基础款"] },
  { id: 10, name: "程序员格子衬衫", category: "clothing", price: 15900, stock: 2, rating: 3.8, createdAt: "2026-01-30T08:00:00Z", tags: ["经典", "衬衫"] },
  { id: 11, name: "挂耳咖啡 20 包", category: "food", price: 5900, stock: 100, rating: 4.6, createdAt: "2026-05-02T08:00:00Z", tags: ["咖啡", "提神"] },
  { id: 12, name: "每日坚果礼盒", category: "food", price: 9900, stock: 35, rating: 4.3, createdAt: "2026-02-08T08:00:00Z", tags: ["零食", "健康"] },
  { id: 13, name: "黑巧克力 72%", category: "food", price: 3200, stock: 0, rating: 4.7, createdAt: "2026-03-19T08:00:00Z", tags: ["零食", "巧克力"] },
  { id: 14, name: "能量饮料 6 罐", category: "food", price: 4500, stock: 48, rating: 3.9, createdAt: "2025-09-30T08:00:00Z", tags: ["饮料", "提神"] },
];
