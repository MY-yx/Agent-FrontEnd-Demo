import { describe, expect, it } from "vitest";
import { formatDate, formatPrice, formatRating, stockLabel, truncate } from "../../src/utils/format";

describe("formatPrice", () => {
  it("把分转成元并保留两位小数", () => {
    expect(formatPrice(6900)).toBe("¥69.00");
    expect(formatPrice(1250)).toBe("¥12.50");
    expect(formatPrice(5)).toBe("¥0.05");
    expect(formatPrice(0)).toBe("¥0.00");
  });

  it("加上千分位分隔符", () => {
    expect(formatPrice(129900)).toBe("¥1,299.00");
    expect(formatPrice(123456789)).toBe("¥1,234,567.89");
  });

  it("支持负数", () => {
    expect(formatPrice(-2000)).toBe("-¥20.00");
  });

  it("非整数的分四舍五入", () => {
    expect(formatPrice(99.6)).toBe("¥1.00");
  });
});

describe("formatDate", () => {
  it("格式化成 YYYY-MM-DD", () => {
    expect(formatDate("2026-03-05T08:00:00Z")).toBe("2026-03-05");
    expect(formatDate("2025-12-31T23:59:59Z")).toBe("2025-12-31");
  });

  it("无法解析时返回空字符串", () => {
    expect(formatDate("not a date")).toBe("");
  });
});

describe("truncate", () => {
  it("没超过长度时原样返回", () => {
    expect(truncate("hello", 10)).toBe("hello");
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("超过长度时截断，并且总长度不超过 max", () => {
    expect(truncate("hello world", 8)).toBe("hello w…");
    expect(truncate("hello world", 8)).toHaveLength(8);
  });
});

describe("stockLabel", () => {
  it("根据库存返回对应文案", () => {
    expect(stockLabel(0)).toBe("缺货");
    expect(stockLabel(-1)).toBe("缺货");
    expect(stockLabel(1)).toBe("仅剩 1 件");
    expect(stockLabel(5)).toBe("仅剩 5 件");
    expect(stockLabel(6)).toBe("有货");
  });
});

describe("formatRating", () => {
  it("保留一位小数", () => {
    expect(formatRating(4)).toBe("4.0");
    expect(formatRating(4.56)).toBe("4.6");
  });
});
