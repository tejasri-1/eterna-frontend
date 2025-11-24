"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Token } from "../../store/tokensSlice";
import { fmtPrice, fmtCompact } from "../../utils/format";
import { useAppSelector } from "../../utils/hooks";
import clsx from "clsx";

import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalTrigger, ModalContent } from "../ui/Modal";

function TokenRow({ token }: { token: Token }) {
  const live = useAppSelector((s) => s.tokens.byId[token.id]) ?? token;

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
  }, [live.price]);

  const changeSign = live.change24h >= 0 ? "positive" : "negative";
  const priceDisplay = fmtPrice(live.price);

  return (
    <tr className="group">
      {/* TOKEN NAME + FLAGS */}
      <td className="p-3 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="font-medium">{live.symbol}</div>
          <div className="text-xs text-slate-400">{live.name}</div>
        </div>

        <div className="ml-2 flex gap-2">
          {live.flags?.map((flag) => {
            const colorMap: any = {
              new: "bg-green-900/30 border-green-600 text-green-300",
              migrated: "bg-orange-900/30 border-orange-600 text-orange-300",
              "final-stretch": "bg-purple-900/30 border-purple-600 text-purple-300",
            };

            const meaning =
              flag === "new"
                ? "Recently listed trading pair"
                : flag === "migrated"
                ? "Token has migrated to a new contract"
                : flag === "final-stretch"
                ? "Token nearing migration completion"
                : "";

            return (
              <Tooltip key={flag}>
                <TooltipTrigger asChild>
                  <div
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full border cursor-help",
                      colorMap[flag]
                    )}
                  >
                    {flag === "new"
                      ? "New Pair"
                      : flag === "migrated"
                      ? "Migrated"
                      : "Final Stretch"}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="!bg-white !text-black">
                  {meaning}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </td>

      {/* PRICE */}
      <td className="p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={clsx(
                "inline-block px-2 py-1 rounded-md transition-colors duration-500 cursor-help",
                {
                  "bg-green-900/40": flash === "up",
                  "bg-red-900/40": flash === "down",
                }
              )}
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
                  <span
                    className={
                      changeSign === "positive" ? "text-positive" : "text-negative"
                    }
                  >
                    {priceDisplay}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="!bg-white !text-black">
            Latest trade price
          </TooltipContent>
        </Tooltip>
      </td>

      {/* 24H CHANGE */}
      <td className="p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={clsx(
                "text-sm font-medium cursor-help",
                changeSign === "positive" ? "text-positive" : "text-negative"
              )}
            >
              {live.change24h.toFixed(2)}%
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="!bg-white !text-black">
            Price movement in the last 24 hours
          </TooltipContent>
        </Tooltip>
      </td>

      {/* MARKET CAP */}
      <td className="p-3 text-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-slate-300 cursor-help">
              {fmtCompact(live.marketCap)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="!bg-white !text-black">
            Total market capitalization
          </TooltipContent>
        </Tooltip>
      </td>

      {/* PAIRS */}
      <td className="p-3 text-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">{live.pairs}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="!bg-white !text-black">
            Number of trading pairs available
          </TooltipContent>
        </Tooltip>
      </td>

      {/* ACTIONS */}
      <td className="p-3">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200">
              Details
            </PopoverTrigger>
            <PopoverContent
              className="w-64 rounded-md shadow-lg p-3 text-black"
              style={{ backgroundColor: "white", color: "black" }}
            >
              <div className="text-sm">
                <div className="font-semibold">{live.symbol} details</div>
                <div className="text-xs text-gray-700">{live.name}</div>
                <div className="mt-2 text-xs">
                  Price: <span className="font-semibold">{priceDisplay}</span>
                </div>
                <div className="text-xs">
                  Market cap: {fmtCompact(live.marketCap)}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Modal>
            <ModalTrigger asChild>
              <button className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200">
                Open modal
              </button>
            </ModalTrigger>
            <ModalContent
              title={`${live.symbol} — Pair actions`}
              className="rounded-md shadow-lg p-4 !bg-white !text-black"
              style={{ backgroundColor: "white", color: "black" }}
            >
              <div className="text-sm">
                <div className="font-semibold">{live.symbol} actions</div>
                <div className="mt-2 text-xs text-gray-700">
                  Price: {priceDisplay}
                </div>
                <div className="mt-3">
                  <button className="px-3 py-2 bg-black/10 text-black rounded-md">
                    View on explorer
                  </button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default React.memo(TokenRow);
