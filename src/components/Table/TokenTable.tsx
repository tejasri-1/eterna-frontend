// src/components/Table/TokenTable.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "../../utils/hooks";
import { setTokens, setLoading, setError } from "../../store/tokensSlice";
import { useAppSelector } from "../../utils/hooks";
import TokenRow from "./TokenRow";
import useWebSocketMock from "../../hooks/useWebSocketMock";
import clsx from "clsx";

type SortKey = "price" | "change24h" | "marketCap" | "pairs" | "symbol";

function fetchTokens() {
  return fetch("/api/mock/tokens").then((r) => r.json());
}

export default function TokenTable() {
  const dispatch = useAppDispatch();
  const tokensState = useAppSelector((s) => s.tokens);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [desc, setDesc] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "migrated">("all");
  const [wsEnabled, setWsEnabled] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 60_000
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (error) dispatch(setError(String(error)));
    if (data?.tokens) dispatch(setTokens(data.tokens));
  }, [data, isLoading, error, dispatch]);

  // connect websocket mock to apply live updates (we keep enabled toggle)
  useWebSocketMock(wsEnabled);

  const tokenList = useMemo(() => {
    const arr = tokensState.ids.map((id) => tokensState.byId[id]).filter(Boolean);
    let filtered = arr;
    if (filter === "new") filtered = arr.filter((t) => t.flags?.includes("New pair"));
    if (filter === "migrated") filtered = arr.filter((t) => t.flags?.includes("Migrated"));
    filtered.sort((a, b) => {
      const vA = (a as any)[sortKey];
      const vB = (b as any)[sortKey];
      if (typeof vA === "string") return desc ? vB.localeCompare(vA) : vA.localeCompare(vB);
      return desc ? Number(vB) - Number(vA) : Number(vA) - Number(vB);
    });
    return filtered;
  }, [tokensState, sortKey, desc, filter]);

  return (
    <section className="bg-surface/80 rounded-2xl p-4 shadow-lg border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => { setFilter("all"); }}
            className={clsx("px-3 py-1 rounded-md text-sm", filter === "all" ? "bg-white/6" : "hover:bg-white/3")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("new")}
            className={clsx("px-3 py-1 rounded-md text-sm", filter === "new" ? "bg-white/6" : "hover:bg-white/3")}
          >
            New pairs
          </button>
          <button
            onClick={() => setFilter("migrated")}
            className={clsx("px-3 py-1 rounded-md text-sm", filter === "migrated" ? "bg-white/6" : "hover:bg-white/3")}
          >
            Migrated
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={wsEnabled} onChange={(e) => setWsEnabled(e.target.checked)} />
            live updates
          </label>
          <div className="text-xs text-slate-400">Rows: {tokenList.length}</div>
        </div>
      </div>

      <div className="w-full overflow-auto rounded-md">
        <table className="min-w-[900px] w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-400 border-b border-white/3">
              <th className="p-3">Token</th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortKey("price"); setDesc((d) => (sortKey === "price" ? !d : true)); }}>
                Price
              </th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortKey("change24h"); setDesc((d) => (sortKey === "change24h" ? !d : true)); }}>
                24h %
              </th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortKey("marketCap"); setDesc((d) => (sortKey === "marketCap" ? !d : true)); }}>
                Market Cap
              </th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortKey("pairs"); setDesc((d) => (sortKey === "pairs" ? !d : true)); }}>
                Pairs
              </th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="p-3">
                  <div className="h-6 w-36 bg-white/4 rounded-md shimmer" />
                </td>
                <td className="p-3"><div className="h-6 w-24 bg-white/4 rounded-md shimmer" /></td>
                <td className="p-3"><div className="h-6 w-16 bg-white/4 rounded-md shimmer" /></td>
                <td className="p-3"><div className="h-6 w-28 bg-white/4 rounded-md shimmer" /></td>
                <td className="p-3"><div className="h-6 w-10 bg-white/4 rounded-md shimmer" /></td>
                <td className="p-3"><div className="h-6 w-16 bg-white/4 rounded-md shimmer" /></td>
              </tr>
            ))}

            {!isLoading && tokenList.map((t) => <TokenRow key={t.id} token={t} />)}

            {!isLoading && tokenList.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">No tokens match the filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
