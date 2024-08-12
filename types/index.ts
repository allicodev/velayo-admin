export * from "./layout.interface";
export * from "./schema.interface";
export * from "./props.interface";
export * from "./store.interface";
export * from "./service.interface";

export interface Response {
  code: number;
  success: boolean;
  message?: string;
}

export interface ExtendedResponse<T> extends Response {
  data?: T;
  meta?: {
    total: number;
    [key: string]: any;
  };
}

export interface ApiGetProps {
  endpoint: string;
  query?: Record<any, any>;
  publicRoute?: boolean;
}

export interface ApiPostProps {
  endpoint: string;
  payload?: Record<any, any>;
  publicRoute?: boolean;
}

export interface ItemCode {
  value: number;
}

export interface PageProps {
  pageSize?: number;
  page?: number;
  _id?: string;
  total?: number;
  role?: string[] | undefined;
  searchKey?: string;
  [key: string]: any;
}

export type Deduction = {
  name?: string | null;
  amount?: number | null;
};
export interface NewUser {
  name: string;
  email: string;
  username: string;
  role: string;
  password?: string;
  employeeId?: string;
  baseSalary: number;
  deductions: Deduction[];
}

export interface DashboardData {
  totalTransaction: number;
  totalTransactionToday: number;
  totalSales: number;
  totalNetSales: number;
  totalBranch: number;
  branchSales: BranchSales[];
  topItemSales: TopItem[];
  salesPerMonth: SalesPerMonth;
  salesPerType: any[];
}

export interface BranchSales {
  name: string;
  total: number;
  percentValue: string;
}

export interface TopItem {
  name: string;
  quantity: number;
}

export interface SalesPerMonth {
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
}

export interface SalesTypePerMonth {
  _id: string;
  sales: any;
}
