import { UserCredit, UserCreditData } from "@/types";
import Api from "./api.service";
abstract class CreditService {
  private static readonly instance = new Api();

  public static async getUserCredit(_id?: string) {
    return this.instance.get<UserCreditData[]>({
      endpoint: "/credit",
      query: { _id },
    });
  }

  public static async newCreditUser(creditUser: UserCredit) {
    return this.instance.post({ endpoint: "/credit", payload: creditUser });
  }

  public static async updateCreditUser(creditUser: UserCredit) {
    return this.instance.post({ endpoint: "/credit", payload: creditUser });
  }

  public static async deleteCreditUser(_id: string) {
    return this.instance.get({ endpoint: "/credit/delete", query: { _id } });
  }
}

export default CreditService;
