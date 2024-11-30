import { User } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { data: any } = { data: {} };

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
});

export const { setUsers } = userReducer.actions;
export default userReducer.reducer;

interface SetUser {
  type: string;
  data: User[];
}
