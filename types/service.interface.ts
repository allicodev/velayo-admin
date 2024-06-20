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
