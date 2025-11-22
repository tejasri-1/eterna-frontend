// src/components/Table/TokenRow.tsx
"use client";
import React, { useMemo } from "react";
import type { Token } from "../../store/tokensSlice";
import { fmtPrice, fmtCompact } from "../../utils/format";
import { useAppSelector } from "../../utils/hooks";
import clsx from "clsx";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";

export default function TokenRow({ token }: { token: Token }) {
  // read live token from redux store for price updates
  const live = useAppSelector((s) => s.tokens.byId[token.id]) ?? token;

  const changeSign = live.change24h >= 0 ? "positive" : "negative";
  const priceColor = live.change24h >= 0 ? "text-positive" : "text-negative";

  const priceDisplay = useMemo(() => fmtPrice(live.price), [live.price]);

  return (
    <tr className="group hover:bg-white/3 transition-colors">
      <td className="p-3 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="font-medium">{live.symbol}</div>
          <div className="text-xs text-slate-400">{live.name}</div>
        </div>

        <div className="ml-2 flex gap-2">
          {live.flags?.map((f) => (
            <span key={f} className="bg-white/6 text-xs px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </td>

      <td className="p-3">
        <AnimatePresence initial={false}>
          <motion.div
            key={priceDisplay}
            initial={{ opacity: 0, translateY: -4 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 4 }}
            transition={{ duration: 0.28 }}
            className={clsx("font-medium")}
            style={{ willChange: "transform, opacity" }}
          >
            <span className={priceColor}>{priceDisplay}</span>
          </motion.div>
        </AnimatePresence>
      </td>

      <td className="p-3">
        <div className={clsx("text-sm font-medium", changeSign === "positive" ? "text-positive" : "text-negative")}>
          {live.change24h.toFixed(2)}%
        </div>
      </td>

      <td className="p-3 text-sm text-slate-300">{fmtCompact(live.marketCap)}</td>

      <td className="p-3 text-sm">{live.pairs}</td>

      <td className="p-3">
        <div className="flex gap-2">
          <Popover.Root>
            <Popover.Trigger className="px-3 py-1 bg-white/6 rounded-md text-sm">Details</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content side="right" className="rounded-md p-3 bg-surface border border-white/5 shadow-lg w-64">
                <div className="text-sm">
                  <div className="font-medium">{live.symbol} details</div>
                  <div className="text-xs text-slate-400">{live.name}</div>
                  <div className="mt-2 text-xs">
                    Price: <span className="font-semibold">{fmtPrice(live.price)}</span>
                  </div>
                  <div className="text-xs">Market cap: {fmtCompact(live.marketCap)}</div>
                </div>
                <Popover.Arrow className="fill-surface" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="px-3 py-1 bg-white/6 rounded-md text-sm">Action</button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="top" align="center" className="rounded-md p-2 bg-black/70 text-xs">
                  Quick action: view pair
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </td>
    </tr>
  );
}
