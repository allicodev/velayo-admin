import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { LogData, Status } from "@/types";
import { LogState } from "./log.types";
import { getLogs } from "./log.thunk";

const initialState: LogState = { data: [], status: Status.IDLE };

const userReducer = createSlice({
  name: "log",
  initialState,
  reducers: {
    setLogs: (state, action: PayloadAction<LogData[]>) => {
      state.data = action.payload;
    },
    pushLogs: (state, action: PayloadAction<LogData[]>) => {
      state.data = _.uniqBy([...state.data, ...action.payload], "_id");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogs.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(getLogs.rejected, (state) => {
        state.status = Status.FAILED;
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = Status.SUCCESS;
      });
  },
});

export const { setLogs, pushLogs } = userReducer.actions;
export default userReducer.reducer;
