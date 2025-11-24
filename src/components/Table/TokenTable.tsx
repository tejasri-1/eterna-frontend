"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { setTokens, setLoading, setError } from "../../store/tokensSlice";
import TokenRow from "./TokenRow";
import useWebSocketMock from "../../hooks/useWebSocketMock";
import clsx from "clsx";

import { TooltipProvider } from "../ui/tooltip";

type SortKey = "symbol" | "price" | "change24h" | "marketCap" | "pairs";

function fetchTokens() {
  return fetch("/api/mock/tokens").then((r) => r.json());
}

export default function TokenTable() {
  const dispatch = useAppDispatch();
  const tokensState = useAppSelector((s) => s.tokens);

  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [desc, setDesc] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "final-stretch" | "migrated">("all");
  const [wsEnabled, setWsEnabled] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 60_000,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (error) dispatch(setError(String(error)));
    if (data?.tokens) dispatch(setTokens(data.tokens));
  }, [data, isLoading, error, dispatch]);

  useWebSocketMock(wsEnabled);

  const tokenList = useMemo(() => {
    const arr = tokensState.ids.map((id) => tokensState.byId[id]).filter(Boolean);
    let filtered = arr;

    if (filter !== "all") filtered = arr.filter((t) => t.flags?.includes(filter));

    filtered.sort((a, b) => {
      const A = (a as any)[sortKey];
      const B = (b as any)[sortKey];

      if (typeof A === "string") return desc ? B.localeCompare(A) : A.localeCompare(B);
      return desc ? Number(B) - Number(A) : Number(A) - Number(B);
    });

    return filtered;
  }, [tokensState, sortKey, desc, filter]);

  return (
    <section className="bg-surface/80 rounded-2xl p-4 shadow-lg border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-3 items-center">
          {[
            { key: "all", label: "All" },
            { key: "new", label: "New pairs" },
            { key: "final-stretch", label: "Final Stretch" },
            { key: "migrated", label: "Migrated" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              className={clsx(
                "px-3 py-1 rounded-md text-sm",
                filter === btn.key ? "bg-white/6" : "hover:bg-white/3"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={wsEnabled} onChange={(e) => setWsEnabled(e.target.checked)} />
          live updates
        </label>
      </div>

      {error && <div className="p-6 text-center text-red-400">Failed to load tokens — retrying...</div>}

      <TooltipProvider delayDuration={80}>
        <div className="w-full overflow-auto rounded-md">
          <table className="min-w-[900px] w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-white/3">
                <Th sortable sortKey={sortKey} desc={desc} setSortKey={setSortKey} setDesc={setDesc} column="symbol">Token</Th>
                <Th sortable sortKey={sortKey} desc={desc} setSortKey={setSortKey} setDesc={setDesc} column="price">Price</Th>
                <Th sortable sortKey={sortKey} desc={desc} setSortKey={setSortKey} setDesc={setDesc} column="change24h">24h %</Th>
                <Th sortable sortKey={sortKey} desc={desc} setSortKey={setSortKey} setDesc={setDesc} column="marketCap">Market Cap</Th>
                <Th sortable sortKey={sortKey} desc={desc} setSortKey={setSortKey} setDesc={setDesc} column="pairs">Pairs</Th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-3"><div className="h-6 w-36 bg-white/4 rounded-md shimmer" /></td>
                  <td className="p-3"><div className="h-6 w-24 bg-white/4 rounded-md shimmer" /></td>
                  <td className="p-3"><div className="h-6 w-16 bg-white/4 rounded-md shimmer" /></td>
                  <td className="p-3"><div className="h-6 w-28 bg-white/4 rounded-md shimmer" /></td>
                  <td className="p-3"><div className="h-6 w-10 bg-white/4 rounded-md shimmer" /></td>
                  <td className="p-3"><div className="h-6 w-16 bg-white/4 rounded-md shimmer" /></td>
                </tr>
              ))}

              {!isLoading && tokenList.map((t) => <TokenRow key={t.id} token={t} />)}

              {!isLoading && tokenList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No tokens match the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TooltipProvider>
    </section>
  );
}

function Th({ children, column, sortable, sortKey, desc, setSortKey, setDesc }: any) {
  return (
    <th className={clsx("p-3 select-none", sortable && "cursor-pointer")} onClick={() => {
      if (!sortable) return;
      setDesc(sortKey === column ? !desc : true);
      setSortKey(column);
    }}>
      <div className="flex items-center gap-1">
        {children}
        {sortKey === column && <span className="text-xs">{desc ? "↓" : "↑"}</span>}
      </div>
    </th>
  );
}
