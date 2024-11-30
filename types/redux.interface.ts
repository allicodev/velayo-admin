export interface BaseReduxState {
  status: Status;
}

export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}
