import { PageProps as GetUserProps } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// services
import UserService from "@/provider/user.service";

const getUser = createAsyncThunk<any, GetUserProps>(
  "user/getUser",
  async ({ page = 1, fetchAll = true, pageSize, type, ...prop }) => {
    const { success, data } = await UserService.getUsers({
      page: 1,
      pageSize: fetchAll ? 9999 : pageSize,
      ...prop,
    });

    if (success ?? false) return { data, type };
  }
);

export { getUser };
