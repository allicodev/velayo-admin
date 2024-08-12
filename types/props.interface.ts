import { CSSProperties, ReactNode } from "react";
import {
  BillingsFormField,
  BranchData,
  BranchItem,
  ItemUnit,
  LogType,
  Wallet,
} from "./schema.interface";
import { NewUser } from ".";

export type StockType = "stock-in" | "stock-out" | "misc";

export interface POSButtonProps {
  label: string;
  value: string;
  icon: any;
  onClick: (str: string) => void;
}

export interface InputProps {
  name?: string;
  unit?: ItemUnit | undefined;
  price?: number;
  quantity?: number;
  cost?: number;
}

export interface FloatLabelProps {
  children: ReactNode;
  label: string;
  value?: string;
  style?: CSSProperties;
  bool?: boolean;
  labelClassName?: string;
  extra?: ReactNode;
  labelStyle?: CSSProperties;
}

export interface NewUserProps {
  open: boolean;
  close: () => void;
  onAdd: (obj: NewUser) => void;
  onSave: (obj: NewUser) => void;
  user?: NewUser | null;
}

export interface UserProps {
  name: string;
  key?: number | string;
  username: string;
  email: string;
  role: string;
  dateCreated?: Date;
}

export interface BasicContentProps {
  title?: string;
  style?: CSSProperties;
  extra?: ReactNode;
  extraData?: any;
  refresh?: number;
}

export interface NewLog {
  userId: string;
  type: LogType;
  branchId?: string;
  [key: string]: any;
}

export interface StockProps {
  open: boolean;
  close: () => void;
  type: "stock-in" | "stock-out" | null;
  branchId: string;
  branchItems: BranchItem[];
  onSubmit: (_: BranchData | null) => void;
}

export interface NewBillerProps {
  open: boolean;
  close: () => void;
  onSave: (str: string) => boolean | void;
}

export interface NewOptionProps {
  open: boolean;
  close: () => void;
  formfield?: BillingsFormField | null;
  onSave: (obj: BillingsFormField) => void;
  id: string | null;
  index: number;
  refresh?: () => void;
  markAsMain: (id: string, index: number) => Promise<boolean | void>;
  deleteOption: (id: string, index: number) => Promise<boolean | void>;
}

export interface NewWalletProps {
  open: boolean;
  close: () => void;
  onSave: (obj: Wallet) => Promise<string>;
}

export interface UpdateBillerProps {
  open: boolean;
  close: () => void;
  onSave: (str: string) => boolean | void;
  name: string;
}

export interface BalanceUpdaterProps {
  open: boolean;
  close?: () => void;
  _id?: string | null;
  name?: string | null;
  type?: "add" | "subract" | null;
  refresh?: () => void;
}

export interface NewPortalProps {
  name: string;
  assignTo: string[];
  _id?: string;
}

export interface NewItemProps {
  title: string;
  open: boolean;
  close: () => void;
  parentId?: string;
  onSave: (str: any) => Promise<boolean>;
}

export interface StockHistory {
  _id?: string;
  date?: Date;
  type?: StockType;
  quantity?: number;
  name?: string;
}

export type CreditStatus = "completed" | "pending" | "overdue";

export interface Credit {
  amount: number;
  status: CreditStatus;
  createdAt: Date;
}

export interface DailyTimeRecord {
  date: Date;
}
