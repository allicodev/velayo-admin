import { configureStore } from "@reduxjs/toolkit";
import branchItemReducer from "./itemSlice";
import counterReducer from "./counterSlice";
import tellerSlice from "./tellerSlice";
import filterSlice from "./filterSlice/filterSlice";
import logSlice from "./logSlice/logSlice";

export const store = configureStore({
  reducer: {
    item: counterReducer,
    branchItem: branchItemReducer,
    teller: tellerSlice,
    filter: filterSlice,
    logs: logSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
