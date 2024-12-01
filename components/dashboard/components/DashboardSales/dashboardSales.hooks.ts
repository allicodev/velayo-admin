import { useEffect, useState } from "react";

import { SalesProp } from "./dashboardSales";
import { SalesPerMonth } from "@/types";

const useSales = (props: SalesProp) => {
  const { data } = props;
  const [sales, setSales] = useState<SalesPerMonth>();

  const generateData = () => {
    return [
      sales?.Jan ?? 0,
      sales?.Feb ?? 0,
      sales?.Mar ?? 0,
      sales?.Apr ?? 0,
      sales?.May ?? 0,
      sales?.Jun ?? 0,
      sales?.Jul ?? 0,
      sales?.Aug ?? 0,
      sales?.Sep ?? 0,
      sales?.Oct ?? 0,
      sales?.Nov ?? 0,
      sales?.Dec ?? 0,
    ];
  };

  useEffect(() => {
    setSales(data);
  }, [data]);
  // return necessary data
  return { ...props, generateData };
};

export default useSales;
