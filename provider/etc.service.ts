import { FilterProps } from "@/components/transaction/transaction.types";
import API from "./api.service";
import {
  DashboardData,
  EloadSettings,
  Response,
  SalesPerMonth,
  Transaction,
} from "@/types";

abstract class EtcService {
  public static async getTransactionFromTraceId(traceId: string) {
    return await API.get<Transaction>({
      endpoint: "/transaction/search-transaction",
      query: {
        traceId,
      },
    });
  }

  public static async checkSettings() {
    return await API.get<Response>({
      endpoint: "/etc/check-settings",
    });
  }

  public static async getEloadSettings() {
    return await API.get<EloadSettings>({
      endpoint: "/etc/eload-settings",
    });
  }

  public static async updateEloadSettings(payload: any) {
    return await API.post<Response>({
      endpoint: "/etc/eload-settings-update",
      payload,
    });
  }

  public static async getDashboardData() {
    return await API.get<DashboardData>({
      endpoint: "/etc/dashboard",
    });
  }

  public static async getDashboardDataSales(filter: FilterProps) {
    return await API.get<SalesPerMonth>({
      endpoint: "/etc/get-sales",
      query: filter,
    });
  }
}

export default EtcService;
