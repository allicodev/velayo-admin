import { SalesPerMonth } from "@/types";

export type FilterProp = {
  type: null | "bills" | "wallet" | "eload" | "miscellaneous";
  year: number;
};

export interface SalesProp {
  isMobile?: boolean;
  data: SalesPerMonth;
  loading?: boolean;
  filter: FilterProp;
  setFilter: (_: FilterProp) => void;
  type?: "bills" | "wallet" | "eload" | "miscellaneous" | null;
  max: number;
}
