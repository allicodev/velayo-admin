import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BranchData } from "@/types";

const initialState: { data: BranchData[] } = { data: [] };

const branchReducer = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<BranchData[]>) => {
      state.data = action.payload;
      return;
    },
  },
});

export const { setBranches } = branchReducer.actions;
export default branchReducer.reducer;
