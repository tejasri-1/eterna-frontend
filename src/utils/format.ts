// src/utils/format.ts
export function fmtPrice(n: number) {
  if (!Number.isFinite(n)) return "-";
  if (n >= 1) return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return "$" + n.toFixed(6);
}

export function fmtCompact(n: number) {
  return n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n.toLocaleString();
}
