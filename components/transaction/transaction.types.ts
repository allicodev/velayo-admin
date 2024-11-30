import { TransactionHistoryStatus, TransactionType } from "@/types";
import { Dayjs } from "dayjs";

export interface FilterProps {
  status?: TransactionHistoryStatus | null;
  type?: TransactionType | null;
  tellerId?: string | null;
  encoderId?: string | null;
  sub_type?: string | null;
  fromDate?: Dayjs | null;
  toDate?: Dayjs | null;
}

export interface TotalProps {
  amount: number;
  fee: number;
}

export interface GetTransaction {
  page: number;
  pageSize?: number;
  tellerId?: string;
  encoderId?: string;
  branchId?: string;
  type?: TransactionType | null;
  status?: TransactionHistoryStatus | null;
  sub_type?: string | null;
  updateTransact?: boolean;
  project?: Record<any, any>;
  fromDate?: Dayjs | null;
  toDate?: Dayjs | null;
}
