import { ItemData } from "./schema.interface";

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
