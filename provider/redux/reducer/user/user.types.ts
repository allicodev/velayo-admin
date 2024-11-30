import { PageProps, Status, User } from "@/types";

export interface UserState {
  data: {
    [key: string]: any;
  };
  status: Status;
}

export interface SetUser {
  type: string;
  data: User[];
}

export interface GetUser extends PageProps {
  type: string;
  fetchAll: boolean;
  pageSize: number;
}
