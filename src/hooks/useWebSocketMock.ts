// File: src/hooks/useWebSocketMock.ts
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { updateTokenPrice } from "../store/tokensSlice";

export default function useWebSocketMock(enabled: boolean = true) {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((s) => s.tokens);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      for (const id of tokens.ids) {
        const token = tokens.byId[id];
        if (!token) continue;

        const lastPrice = token.price;
        const newPrice =
          +(lastPrice + (Math.random() - 0.5) * 0.003 * lastPrice).toFixed(6);

        dispatch(updateTokenPrice({ id, price: newPrice }));
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [dispatch, tokens, enabled]);
}
