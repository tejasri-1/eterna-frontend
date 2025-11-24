"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { updateTokenPrice } from "../store/tokensSlice";

export default function useWebSocketMock(enabled: boolean) {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((s) => s.tokens);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (tokens.ids.length === 0) return;

      const randomId = tokens.ids[Math.floor(Math.random() * tokens.ids.length)];
      const token = tokens.byId[randomId];
      if (!token) return;

      const lastPrice = token.price;

      // SLOWER + REALISTIC PRICE UPDATE
      const newPrice = +(
        lastPrice + (Math.random() - 0.5) * 0.001 * lastPrice
      ).toFixed(6);

      // Other values update slowly
      const newChange = +(token.change24h + (Math.random() - 0.5) * 0.15).toFixed(2);
      const newMarketCap = Math.max(1e6, token.marketCap + Math.floor((Math.random() - 0.5) * 50_000));
      const newPairs = Math.max(1, token.pairs + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0));

      dispatch(
        updateTokenPrice({
          id: randomId,
          price: newPrice,
          change24h: newChange,
          marketCap: newMarketCap,
          pairs: newPairs,
        })
      );
    }, 550); // <<--- Slower realistic update speed

    return () => clearInterval(interval);
  }, [enabled, tokens.ids, tokens.byId, dispatch]);
}
