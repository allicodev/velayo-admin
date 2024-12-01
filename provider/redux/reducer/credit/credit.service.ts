import { createAsyncThunk } from "@reduxjs/toolkit";

// services
import CreditService from "@/provider/credit.service";
import { GetUserCreditParams } from "./credit.types";

const resourceKey = "users";

const getUserCredit = createAsyncThunk<any, GetUserCreditParams>(
  "user/getUserCredit",
  async ({ optimistic, cb }, thunkAPI) => {
    const { success, data } = await CreditService.getUserCredit();

    if (success ?? false) {
      if (cb) cb();

      return { data, type: "credit" };
    }
  }
);

export { getUserCredit };
