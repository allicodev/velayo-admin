import { configureStore } from "@reduxjs/toolkit";
import branchItemReducer from "./itemSlice";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    item: counterReducer,
    branchItem: branchItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
