import { BranchSales } from "@/types";
import { useEffect, useState } from "react";
import { SalesBranchProps } from "./salesBranch.types";

const useSaleBranch = (props: SalesBranchProps) => {
  const { data } = props;
  const [branchData, setBranchData] = useState<BranchSales[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setBranchData(data);
    }
  }, [data]);
  // return necessary data;
  return { ...props, branchData };
};

export default useSaleBranch;
