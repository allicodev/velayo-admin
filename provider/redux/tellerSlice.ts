import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TellerState, User } from "@/types";

const initialState: TellerState = { data: [] };

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setTellers: (state, action: PayloadAction<User[]>) => {
      state = { ...state, data: action.payload };
      return state;
    },
  },
});

export const { setTellers } = itemSlice.actions;
export default itemSlice.reducer;
