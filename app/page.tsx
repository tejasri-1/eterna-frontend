// app/page.tsx
"use client";
import TokenTable from "../src/components/Table/TokenTable";

export default function Page() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Pulse — Token discovery</h1>
          <p className="text-sm text-slate-400">Real-time prices, new pairs, migrations — mock data.</p>
        </header>
        <TokenTable />
      </div>
    </main>
  );
}
