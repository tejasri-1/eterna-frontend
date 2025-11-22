// File: app/api/mock/tokens/route.ts
import { NextResponse } from "next/server";

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function genToken(i: number) {
  const price = Number((randomFloat(0.1, 1500)).toFixed(6));
  // Spread flags across tokens: New pair, Migrated, Final Stretch
  const flagRoll = i % 13;
  const flags: string[] = [];
  if (flagRoll === 0) flags.push("new");
  if (flagRoll === 1) flags.push("migrated");
  if (flagRoll === 2) flags.push("final-stretch");
  if (flagRoll === 3) flags.push("new", "final-stretch");

  return {
    id: `t-${i}`,
    symbol: ["SOL", "ETH", "BTC", "ABC", "XYZ", "MIG", "NEW"][i % 7] + (i > 6 ? `-${i}` : ""),
    name: `Token ${i}`,
    price,
    change24h: Number((randomFloat(-15, 15)).toFixed(2)),
    marketCap: Math.floor(randomFloat(1e6, 5e9)),
    pairs: Math.floor(randomFloat(1, 120)),
    flags
  };
}

export async function GET() {
  // emulate progressive loading latency
  await new Promise((res) => setTimeout(res, 650));
  const tokens = Array.from({ length: 40 }, (_, i) => genToken(i + 1));
  return NextResponse.json({ tokens });
}
