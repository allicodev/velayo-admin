import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Status } from "@/types";
import { SetUser, UserState } from "./user.types";
import { getUser } from "./user.service";

const initialState: UserState = { data: {}, status: Status.IDLE };

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<SetUser>) => {
      const { type, data } = action.payload;
      state.data[type] = data;
      return;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(getUser.rejected, (state) => {
        state.status = Status.FAILED;
      })
      .addCase(getUser.fulfilled, (state: any, action) => {
        const { data, type } = action.payload;
        state[type] = data;
        state.statis = Status.SUCCESS;
      });
  },
});

export const { setUsers } = userReducer.actions;
export default userReducer.reducer;
