import { BaseReduxService, BaseReduxState, ReduxStateV1 } from "@/types";

export interface LogState extends BaseReduxState, ReduxStateV1 {}

export interface GetLogParams extends BaseReduxService {
  [key: string]: any;
}
