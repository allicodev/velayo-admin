import { UserCredit } from "@/types";

export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface UserState {
  status: Status;
  credit: UserCredit[];
}

export interface SetUser {
  type: "credit";
  data: any[];
}

export interface GetUserParams {
  type: "credit";
  fetchAll?: boolean;
  pageSize?: number;
}
