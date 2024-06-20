import Api from "./api.service";
import {
  BillingsFormField,
  ExtendedResponse,
  Transaction,
  Wallet,
  WalletType,
  Response,
  ExceptionItemProps,
} from "@/types";

class WalletService {
  private readonly instance = new Api();

  public async getWallet(_id?: string | null) {
    return await this.instance.get<Wallet[]>({
      endpoint: "/wallet/get-wallet",
      query: { _id },
    });
  }

  public async newWallet(payload: Wallet): Promise<ExtendedResponse<Wallet>> {
    return await this.instance.post<Wallet>({
      endpoint: "/wallet/new-wallet",
      payload,
    });
  }

  public async updateWalletFee(
    payload: Wallet
  ): Promise<ExtendedResponse<Wallet>> {
    if (payload.cashinFeeValue == null) payload.cashinFeeValue = 0;
    if (payload.cashoutFeeValue == null) payload.cashoutFeeValue = 0;

    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/update-wallet-option",
      payload: {
        id: payload._id,
        walletOption: payload,
      },
    });
    return response;
  }

  public async updateName(
    id: string,
    name: string
  ): Promise<ExtendedResponse<Wallet>> {
    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/update-name",
      payload: {
        id,
        name,
      },
    });
    return response;
  }

  public async pushToFormFields(
    billId: string,
    formfield: BillingsFormField,
    type: WalletType
  ) {
    formfield.slug_name = formfield.name
      .replaceAll(" ", "_")
      .toLocaleLowerCase();
    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/new-option",
      payload: {
        id: billId,
        formField: formfield,
        type,
      },
    });
    return response;
  }

  public async updateWalletFormFields(
    billId: string,
    formfield: BillingsFormField,
    index: number,
    type: WalletType
  ) {
    formfield.slug_name = formfield.name
      .replaceAll(" ", "_")
      .toLocaleLowerCase();
    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/update-wallet",
      payload: {
        id: billId,
        formField: formfield,
        index,
        type,
      },
    });
    return response;
  }

  public async updateWalletOption(walletId: string, walletOption: Wallet) {
    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/update-wallet-option",
      payload: {
        id: walletId,
        walletOption,
      },
    });
    return response;
  }

  public async markWalletMainAmount(
    billId: string,
    index: number,
    type: WalletType
  ) {
    const response = await this.instance.post<Wallet>({
      endpoint: "/wallet/mark-as-main",
      payload: {
        id: billId,
        index,
        type,
      },
    });
    return response;
  }

  public async removeWalletOptionIndexed(
    billId: string,
    index: number,
    type: WalletType
  ) {
    const response = await this.instance.get<Wallet>({
      endpoint: "/wallet/delete-wallet-option",
      query: {
        id: billId,
        index,
        type,
      },
    });
    return response;
  }

  public async requestWalletTransaction(
    biller_name: string,
    bill: string,
    amount: number,
    fee: number,
    tellerId: string,
    branchId: string,
    traceId: string | null,
    walletId?: string | null
  ) {
    let transaction: Transaction = {
      type: "wallet",
      sub_type: biller_name,
      transactionDetails: bill,
      amount,
      fee,
      tellerId,
      branchId,
      walletId,
      history: [
        {
          description: "First  Transaction requested",
          status: "pending",
          createdAt: new Date(),
        },
      ],
    };

    if (traceId) transaction.traceId = traceId;

    const response = await this.instance.post<Response>({
      endpoint: "/bill/request-transaction",
      payload: { ...transaction, branchId },
    });
    return response;
  }

  public async deleteWallet(_id: string): Promise<Response> {
    const response = await this.instance.get<Response>({
      endpoint: "/wallet/delete-wallet",
      query: { _id },
    });
    return response;
  }

  public async updateExceptionWallet(
    _id: string,
    direction: string,
    type: string,
    excludeItems: ExceptionItemProps[]
  ): Promise<Response> {
    const response = await this.instance.post<Response>({
      endpoint: "/wallet/update-exception",
      payload: { _id, direction, excludeItems, type },
    });
    return response;
  }
}

export default WalletService;
