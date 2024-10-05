import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreditState } from "./credit.types";
import { AccountReceivableState } from "@/types";

const initialState: CreditState = { accounts: [] };

const credit = createSlice({
  name: "credit",
  initialState,
  reducers: {
    setAccounts: (state, actions: PayloadAction<AccountReceivableState[]>) => {
      state.accounts = actions.payload;
      return state;
    },
  },
});

export const { setAccounts } = credit.actions;
export default credit.reducer;
