import Api from "./api.service";
import { EloadSettings, Response, Transaction } from "@/types";

class EtcService {
  private readonly instance = new Api();

  public async getTransactionFromTraceId(traceId: string) {
    return await this.instance.get<Transaction>({
      endpoint: "/transaction/search-transaction",
      query: {
        traceId,
      },
    });
  }

  public async checkSettings() {
    return await this.instance.get<Response>({
      endpoint: "/etc/check-settings",
    });
  }

  public async getEloadSettings() {
    return await this.instance.get<EloadSettings>({
      endpoint: "/etc/eload-settings",
    });
  }

  public async updateEloadSettings(payload: any) {
    return await this.instance.post<Response>({
      endpoint: "/etc/eload-settings-update",
      payload,
    });
  }
}

export default EtcService;
