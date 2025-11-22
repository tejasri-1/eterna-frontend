// src/store/tokensSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Token = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  pairs: number;
  flags?: string[]; // e.g., 'New pair', 'Migrated'
};

type TokensState = {
  byId: Record<string, Token>;
  ids: string[];
  loading: boolean;
  error?: string;
};

const initialState: TokensState = {
  byId: {},
  ids: [],
  loading: false
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Token[]>) {
      state.ids = action.payload.map((t) => t.id);
      state.byId = action.payload.reduce((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {} as Record<string, Token>);
      state.loading = false;
      state.error = undefined;
    },
    updatePrice(state, action: PayloadAction<{ id: string; price: number }>) {
      const t = state.byId[action.payload.id];
      if (t) t.price = action.payload.price;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  }
});

export const { setTokens, updatePrice, setLoading, setError } = tokensSlice.actions;
export default tokensSlice.reducer;
