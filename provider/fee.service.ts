import API from "./api.service";
import { Response } from "@/types";

import { ThresholdFeesColumn } from "@/components/wallet/components/threshold.types";

abstract class FeeService {
  public static async newFeeThreshold(payload: Partial<ThresholdFeesColumn>) {
    return await API.post<Response>({
      endpoint: "/fee",
      payload,
    });
  }
  public static async getFeeThreshold(
    type: "bills" | "wallet",
    link_id: string,
    additionalFilter?: Object
  ) {
    return await API.get<ThresholdFeesColumn[]>({
      endpoint: "/fee",
      query: {
        type,
        link_id,
        ...additionalFilter,
      },
    });
  }
}

export default FeeService;
