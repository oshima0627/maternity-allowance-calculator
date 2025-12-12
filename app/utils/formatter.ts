/**
 * 数値を3桁カンマ区切りにフォーマット
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ja-JP');
}

/**
 * 円表示にフォーマット
 */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)}円`;
}

/**
 * パーセント表示にフォーマット
 */
export function formatPercent(value: number): string {
  return `約${value}%`;
}

/**
 * 日付を日本語形式でフォーマット (YYYY年M月D日)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 日付を短縮形式でフォーマット (M/D)
 */
export function formatDateShort(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

/**
 * カンマ区切り文字列を数値に変換
 */
export function parseFormattedNumber(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10) || 0;
}