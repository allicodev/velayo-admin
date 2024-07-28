import { ItemWithCategory } from "./service.interface";

export type ItemUnit = "pc(s)" | "bot(s)" | "kit(s)";
export type RoleType = "teller" | "encoder" | "accounting" | "admin";
export type TransactionHistoryStatus = "completed" | "failed" | "pending";
export type TransactionType =
  | "bills"
  | "wallet"
  | "eload"
  | "miscellaneous"
  | "shopee";

export type BillingOptionsType =
  | "input"
  | "number"
  | "textarea"
  | "checkbox"
  | "select";

export interface Item {
  name: string;
  isParent: boolean;
  parentId: string;
  sub_categories?: Item[] | ItemData[];
  itemCode: number;
  unit: ItemUnit | undefined;
  price: number;
  quantity: number;
  cost: number;
  itemCategory: ItemWithCategory;
}

export interface ItemWithStock {
  itemId: ItemData;
  stock_count: number;
  createdAt: Date;
}

export interface ItemData extends Item {
  _id: string;
  parentName?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: string;
}

export interface UserWithToken extends User {
  token: string;
}

export interface Transaction {
  _id?: string;
  type: TransactionType;
  tellerId: User | string;
  billerId?: string | null;
  walletId?: string | null;
  encoderId?: string | null;
  branchId: Branch | string;
  sub_type?: string;
  transactionDetails: string;
  reference?: string;
  history: TransactionHistory[];
  createdAt?: Date;
  amount?: number;
  fee?: number;
  traceId?: string; // for ewallet cashout
  isOnlinePayment?: boolean;
  portal?: string;
  receiverName?: string;
  recieverNum?: string;
}

export interface TransactionHistory {
  description: string;
  status: TransactionHistoryStatus;
  createdAt: Date;
}

export interface TransactionPOS extends Transaction {
  cash: number;
}

// * branch
export interface Branch {
  name?: string;
  address: string;
  device: string;
  spm: string;
  pin: string;
  items?: BranchItem[];
}

export interface BranchData extends Branch {
  _id?: string;
  createdAt?: Date;
}

export interface BranchItem {
  _id?: string;
  itemId: ItemData;
  stock_count: number;
  createdAt: Date;
}

// * online payment

export interface OnlinePayment {
  isOnlinePayment: boolean;
  portal: string;
  receiverName: string;
  recieverNum: string;
  traceId: string;
  reference?: string;
}

export interface BranchItemUpdate {
  _id: string;
  count: number;
}

// * User

// * Billing
export interface BillingSettingsType {
  _id?: string;
  name: string;
  fee: number;
  threshold: number;
  additionalFee: number;
  formField?: BillingsFormField[];
  exceptFormField?: ExceptionItemProps[];
  isDisabled?: boolean;
}

export interface OptionTypeWithFlag {
  open: boolean;
  options?: BillingsFormField | undefined | null;
  id: string | null;
  index: number;
}

export interface BillingsFormField {
  key?: string;
  type: BillingOptionsType;
  name: string;
  slug_name?: string;
  inputOption?: InputOptions;
  inputNumberOption?: NumberOptions;
  textareaOption?: TextAreaOptions;
  selectOption?: SelectOptions;
}

export interface ExceptionItemProps {
  name: string;
  type: BillingOptionsType;
}

export interface InputOptions {
  minLength?: number | null;
  maxLength?: number | null;
}

export interface NumberOptions {
  mainAmount?: Boolean;
  isMoney?: boolean;
  min?: number | null;
  max?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
}

export interface TextAreaOptions {
  minRow?: number | null;
  maxRow?: number | null;
}

export interface SelectOptions {
  items?: SelectItem[] | null;
}

export interface SelectItem {
  name: string;
  value: string;
}

// * LOG
export type LogType = "attendance" | "stock" | "credit" | "debit" | "portal";

export interface Log {
  type: LogType;
  userId: User;
  branchId?: Branch;

  // for attendance
  timeIn?: Date;
  timeOut?: Date;
  timeInPhoto?: string;
  timeOutPhoto?: string;

  // for stock
  stockType?: "stock-in" | "stock-out";
  items?: ItemWithStock[];

  // portal
  portalId?: Portal;
  amount?: number;
  rebate?: number;

  // credit
  userCreditId?: string;
  dueDate?: Date;
  status?: "pending" | "completed";
  interest?: number;
  history?: CreditAmountHistory[];

  createdAt?: Date;
}

export interface LogData extends Log {
  _id: string;
  createdAt?: Date;
}

// * PORTAL
export interface Portal {
  _id?: string;
  name: string;
  currentBalance: number;
  assignTo: string[];
  requests?: BalanceRequest[];
}

export type BalanceRequestType = "balance_request";

export interface BalanceRequest {
  _id: string;
  type: BalanceRequestType;
  amount: Number;
  portalId: Portal;
  encoderId: User;
  status: "pending" | "completed" | "rejected";
  createdAt: Date;
}

//* Items
export interface Item {
  name: string;
  isParent: boolean;
  parentId: string;
  sub_categories?: Item[] | ItemData[];
  itemCode: number;
  unit: ItemUnit | undefined;
  price: number;
  quantity: number;
  cost: number;
}

export interface ItemWithStock {
  itemId: ItemData;
  stock_count: number;
  createdAt: Date;
}

export interface ItemData extends Item {
  _id: string;
  parentName?: string;
}

// * Branch
export interface Branch {
  name?: string;
  address: string;
  device: string;
  spm: string;
  items?: BranchItem[];
}

export interface BranchData extends Branch {
  _id?: string;
  createdAt?: Date;
}

export interface BranchItem {
  _id?: string;
  itemId: ItemData;
  stock_count: number;
  createdAt: Date;
}

export interface BranchItemUpdate {
  _id: string;
  count: number;
}

// * Wallet

export type WalletType = "cash-in" | "cash-out";
export type FeeType = "percent" | "fixed";

export interface Wallet {
  _id?: string;
  name: string;
  cashinType: FeeType;
  cashinFeeValue: number | null;
  cashoutType: FeeType;
  cashoutFeeValue: number | null;
  cashInFormField: BillingsFormField[];
  cashOutFormField: BillingsFormField[];
  cashInexceptFormField?: ExceptionItemProps[];
  cashOutexceptFormField?: ExceptionItemProps[];
  isDisabled?: boolean;
}

export interface Fee {
  type: FeeType;
  fee: number | null;
}

// * Credit
export interface UserCredit {
  name: string;
  middlename?: string;
  lastname: string;
  address: string;
  phone: string;
  maxCredit: number;
  creditTerm: 7 | 15 | 30;
}

export interface UserCreditData extends UserCredit {
  _id: string;
  history?: CreditHistory[];
  availableCredit: number;
}

export interface CreditHistory {
  userCreditId: UserCreditData | string;
  transactionId: Transaction | string;
  status: "pending" | "completed";
  amount: number;
  createdAt: Date;
  history: CreditAmountHistory[];
}

export interface CreditAmountHistory {
  amount: number;
  date: Date;
  description: string;
}
