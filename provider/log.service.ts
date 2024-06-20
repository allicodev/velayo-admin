import Api from "./api.service";
import { ExtendedResponse, LogData, NewLog, Response } from "@/types";

class LogService {
  private readonly instance = new Api();

  public async newLog({
    ...props
  }: NewLog): Promise<ExtendedResponse<LogData>> {
    return await this.instance.post<LogData>({
      endpoint: "/log",
      payload: {
        postType: "new",
        ...props,
      },
    });
  }

  public async updateLog({ ...props }: { [key: string]: any }) {
    return await this.instance.post<Response>({
      endpoint: "/log",
      payload: {
        postType: "update",
        ...props,
      },
    });
  }

  public async getLog(props: any): Promise<ExtendedResponse<any[]>> {
    return await this.instance.get<any[]>({
      endpoint: "/log",
      query: props,
    });
  }
}

export default LogService;
