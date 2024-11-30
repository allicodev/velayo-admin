import { configureStore } from "@reduxjs/toolkit";
import branchItemReducer from "./itemSlice";
import counterReducer from "./counterSlice";
import tellerSlice from "./tellerSlice";
import filterSlice from "./filterSlice/filterSlice";
import logSlice from "./logSlice/logSlice";
import creditRedux from "./credit/credit.redux";
import transactionReducer from "./reducer/transactions.reducer";
import branchReducer from "./reducer/branch.reducer";
import userReducer from "./reducer/user/user.reducer";

export const store = configureStore({
  reducer: {
    item: counterReducer,
    branchItem: branchItemReducer,
    teller: tellerSlice,
    filter: filterSlice,
    logs: logSlice,
    credit: creditRedux,
    transaction: transactionReducer,
    branch: branchReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
