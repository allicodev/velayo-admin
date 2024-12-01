import { createAsyncThunk } from "@reduxjs/toolkit";

// services
import LogService from "@/provider/log.service";

import { GetLogParams } from "./log.types";

const resourceKey = "logs";

const getLogs = createAsyncThunk<any, GetLogParams>(
  "log/getLog",
  async ({ optimistic, cb, ...prop }, thunkAPI) => {
    const { success, data } = await LogService.getLog(prop);

    if (success ?? false) {
      if (cb) cb();

      return data;
    }
  }
);

export { getLogs };
