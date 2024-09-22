import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FilterState } from "@/types";
import { UpdateFilter } from "./filter.types";

const initialState: FilterState = { disbursement: {} };

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    updateFilter: (state, actions: PayloadAction<UpdateFilter>) => {
      const { key, value } = actions.payload;
      state = { ...state, [key]: value };
      return state;
    },
  },
});

export const { updateFilter } = itemSlice.actions;
export default itemSlice.reducer;
