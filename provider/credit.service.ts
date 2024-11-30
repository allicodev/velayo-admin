import { UserCredit, UserCreditData } from "@/types";
import API from "./api.service";
abstract class CreditService {
  public static async getUserCredit(_id?: string) {
    return API.get<UserCreditData[]>({
      endpoint: "/credit",
      query: { _id },
    });
  }

  public static async newCreditUser(creditUser: UserCredit) {
    return API.post({ endpoint: "/credit", payload: creditUser });
  }

  public static async updateCreditUser(creditUser: UserCredit) {
    return API.post({ endpoint: "/credit", payload: creditUser });
  }

  public static async deleteCreditUser(_id: string) {
    return API.get({ endpoint: "/credit/delete", query: { _id } });
  }

  public static async getAccountReceivable(id?: string | null) {
    return API.get({
      endpoint: "/credit/receivables",
      query: { id },
    });
  }
}

export default CreditService;
