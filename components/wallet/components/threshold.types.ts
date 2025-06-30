export interface ThresholdFees {
  walletId?: string;
  subType: "cash-in" | "cash-out";
}

export interface ThresholdFeesColumn {
  _id?: string;
  type: "bills" | "wallet";
  subType?: string;
  link_id: string;
  minAmount: number;
  maxAmount: number;
  charge: number;
}

export interface ThresholdModalProps {
  open: boolean;
  type: "new" | "edit";
}
