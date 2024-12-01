import { BaseReduxState, PageProps, ReduxStateV2, Status, User } from "@/types";

export interface UserState extends BaseReduxState, ReduxStateV2 {}

export interface SetUser {
  type: string;
  data: User[];
}

export interface GetUser extends PageProps {
  type: string;
  fetchAll: boolean;
  pageSize: number;
}
