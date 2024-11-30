import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Transaction } from "@/types";

const initialState: { data: Transaction[] } = { data: [] };

const transactionReducer = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.data = action.payload;
      return;
    },
  },
});

export const { setTransactions } = transactionReducer.actions;
export default transactionReducer.reducer;
