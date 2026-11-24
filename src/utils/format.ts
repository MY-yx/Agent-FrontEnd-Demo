/** 把"分"格式化成带千分位的人民币金额，例如 123456 -> "¥1,234.56" */
export function formatPrice(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.round(cents));
  const yuan = Math.floor(abs / 100);
  const fen = abs % 100;
  const withCommas = String(yuan).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}¥${withCommas}.${String(fen).padStart(2, "0")}`;
}

/** 把 ISO 时间格式化成 YYYY-MM-DD（按 UTC 计算）。无法解析时返回空字符串 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 超过 max 个字符时截断并加省略号，结果的总长度不超过 max */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1))}…`;
}

/** 库存的展示文案 */
export function stockLabel(stock: number): string {
  if (stock <= 0) return "缺货";
  if (stock <= 5) return `仅剩 ${stock} 件`;
  return "有货";
}

/** 评分保留一位小数 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
