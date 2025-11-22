import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Token = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  pairs: number;
  flags?: string[];
};

type TokensState = {
  ids: string[];
  byId: Record<string, Token>;
  loading: boolean;
  error: string | null;
};

const initialState: TokensState = {
  ids: [],
  byId: {},
  loading: false,
  error: null
};

export const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setTokens(state, action: PayloadAction<Token[]>) {
      state.ids = action.payload.map((t) => t.id);
      state.byId = {};
      for (const t of action.payload) {
        state.byId[t.id] = t;
      }
    },

    // ✅ REAL-TIME LIVE PRICE UPDATES (required by WebSocket mock)
    updateTokenPrice(state, action: PayloadAction<{ id: string; price: number }>) {
      const { id, price } = action.payload;
      const token = state.byId[id];
      if (token) {
        token.price = price;
      }
    }
  }
});

export const { setLoading, setError, setTokens, updateTokenPrice } =
  tokensSlice.actions;

export default tokensSlice.reducer;
