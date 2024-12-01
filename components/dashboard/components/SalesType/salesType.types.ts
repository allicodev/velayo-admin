import { SalesTypePerMonth } from "@/types";

export interface SalesTypeProp {
  isMobile?: boolean;
  data: SalesTypePerMonth[];
  loading?: boolean;
  max: number;
}
