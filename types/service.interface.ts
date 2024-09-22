import { ItemData, UserCreditData } from "./schema.interface";

export interface EloadSettings {
  _id: string;
  disabled_eload: string[];
  fee?: number | undefined;
  threshold?: number | undefined;
  additionalFee?: number | undefined;
}

export interface UserLoginProps {
  username: string;
  password: string;
}

export interface UpdateFeeProps {
  id: string;
  fee: number;
  threshold: number;
  additionalFee: number;
}

export interface ItemWithCategory {
  _id?: string;
  name: string;
  items: ItemData[];
}

export interface UserCreditEdit {
  name?: string;
  middlename?: string;
  lastname?: string;
  address?: string;
  phone?: string;
  maxCredit?: number;
  creditTerm?: 7 | 15 | 30;
}
