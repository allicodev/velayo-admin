import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUserParams, Status, UserState } from "./user.types";
import UserService from "@/provider/user.service";

const initialState: UserState = { status: Status.IDLE, credit: [] };

const getUser = createAsyncThunk<any, GetUserParams>(
  "user/getUser",
  async ({ type, fetchAll = true, pageSize }) => {
    const { success, data } = await UserService.getUsers({
      page: 1,
      pageSize: fetchAll ? 9999 : pageSize,
      type: "credit",
    });

    if (success ?? false) return { data, type };
  }
);

const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

// export const {} = user.actions;
export { getUser };

export default user.reducer;
