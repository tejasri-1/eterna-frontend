// src/hooks/useWebSocketMock.ts
"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../utils/hooks";
import { updatePrice } from "../store/tokensSlice";

export default function useWebSocketMock(enabled: boolean) {
  const dispatch = useAppDispatch();
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Diff-based updates: pick random token IDs and adjust price
    ref.current = window.setInterval(() => {
      // pick 3-6 updates per tick
      const updates = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < updates; i++) {
        const id = `t-${Math.floor(Math.random() * 40) + 1}`;
        // price cent movement
        const delta = (Math.random() - 0.5) * 0.02; // small percent
        // get old price from DOM attribute (we can't access redux state here reliably), so send small random update
        // dispatch approximate update; UI will animate
        dispatch(updatePrice({ id, price: Number((1 + delta).toFixed(6)) * 1 } as any));
      }
    }, 1500);

    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [enabled, dispatch]);
}
