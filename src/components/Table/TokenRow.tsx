// File: src/components/Table/TokenRow.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Token } from "../../store/tokensSlice";
import { fmtPrice, fmtCompact } from "../../utils/format";
import { useAppSelector } from "../../utils/hooks";
import clsx from "clsx";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalTrigger,ModalContent } from "../../components/ui/Modal";

/*
 Why: Read token by id from global store so each row subscribes only to its token.
 This reduces re-renders for the whole table.
*/
function TokenRowInner({ token }: { token: Token }) {
  const live = useAppSelector((s) => s.tokens.byId[token.id]) ?? token;

  // previous price to compute direction and flash
  const prevPriceRef = useRef<number>(live.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const prev = prevPriceRef.current;
    if (live.price > prev) setFlash("up");
    else if (live.price < prev) setFlash("down");
    prevPriceRef.current = live.price;

    if (flash) {
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.price]);

  const changeSign = live.change24h >= 0 ? "positive" : "negative";
  const priceDisplay = fmtPrice(live.price);

  return (
    <tr className="group">
      <td className="p-3 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="font-medium">{live.symbol}</div>
          <div className="text-xs text-slate-400">{live.name}</div>
        </div>

        <div className="ml-2 flex gap-2">
          {live.flags?.map((f) => {
            const label =
              f === "new"
                ? "New Pair"
                : f === "migrated"
                ? "Migrated"
                : f === "final-stretch"
                ? "Final Stretch"
                : f;

            return (
              <span
                key={f}
                className={clsx(
                  "text-xs px-2 py-0.5 rounded-full border",
                  f === "new" && "bg-green-900/30 border-green-600 text-green-300",
                  f === "migrated" && "bg-orange-900/30 border-orange-600 text-orange-300",
                  f === "final-stretch" && "bg-purple-900/30 border-purple-600 text-purple-300"
                )}
              >
                {label}
              </span>
            );
          })}

        </div>
      </td>

      <td className="p-3">
        <div
          // flash background to signal price up/down; uses transform/opacity for smoothness (no layout shift)
          className={clsx("inline-block px-2 py-1 rounded-md transition-colors duration-500", {
            "bg-green-900/40": flash === "up",
            "bg-red-900/40": flash === "down"
          })}
          style={{ willChange: "background-color, opacity" }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={priceDisplay}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.22 }}
              className="font-medium"
            >
              <span className={changeSign === "positive" ? "text-positive" : "text-negative"}>{priceDisplay}</span>
            </motion.div>
          </AnimatePresence>
        </div>
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

          {/* Modal trigger for advanced actions */}
 <Modal>
  <ModalTrigger asChild>
    <button className="px-3 py-1 bg-white/6 rounded-md text-sm">Open modal</button>
  </ModalTrigger>

  <ModalContent title={`${live.symbol} — Pair actions`}>
    <div className="text-sm">
      <div className="font-medium">{live.symbol} actions</div>
      <div className="mt-2 text-xs text-slate-300">Price: {fmtPrice(live.price)}</div>
      <div className="mt-2">
        <button className="px-3 py-2 bg-white/6 rounded-md">View on explorer</button>
      </div>
    </div>
  </ModalContent>
</Modal>


        </div>
      </td>
    </tr>
  );
}

// Export memoized to reduce re-renders
export default React.memo(TokenRowInner);
