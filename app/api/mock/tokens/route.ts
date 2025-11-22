// app/api/mock/tokens/route.ts
// Next.js route handler to mock tokens; returns JSON; placed in app/api/mock/tokens/route.ts
import { NextResponse } from "next/server";

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function genToken(i: number) {
  const price = Number((randomFloat(0.1, 1500)).toFixed(6));
  return {
    id: `t-${i}`,
    symbol: ["SOL", "ETH", "BTC", "ABC", "XYZ", "MIG", "NEW"][i % 7] + (i > 6 ? `-${i}` : ""),
    name: `Token ${i}`,
    price,
    change24h: Number((randomFloat(-15, 15)).toFixed(2)),
    marketCap: Math.floor(randomFloat(1e6, 5e9)),
    pairs: Math.floor(randomFloat(1, 120)),
    flags: i % 7 === 0 ? ["New pair"] : i % 11 === 0 ? ["Migrated"] : []
  };
}

export async function GET() {
  // emulate progressive loading latency
  await new Promise((res) => setTimeout(res, 650));
  const tokens = Array.from({ length: 40 }, (_, i) => genToken(i + 1));
  return NextResponse.json({ tokens });
}
