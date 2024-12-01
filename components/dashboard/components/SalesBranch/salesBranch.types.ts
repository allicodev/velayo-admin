import { BranchSales } from "@/types";

export interface SalesBranchProps {
  isMobile?: boolean;
  data: BranchSales[];
  loading?: boolean;
}
