export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface BaseReduxState {
  status: Status;
}

export interface ReduxStateV1 {
  data: any[];
}
export interface ReduxStateV2 {
  data: {
    [key: string]: any;
  };
}

export interface BaseReduxService {
  optimistic?: boolean;
  cb?: (...args: any[]) => void;
}
