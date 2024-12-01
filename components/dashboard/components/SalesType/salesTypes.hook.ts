import { useEffect, useState } from "react";

import { SalesTypePerMonth } from "@/types";
import { SalesTypeProp } from "./salesType.types";

const useSaleType = (props: SalesTypeProp) => {
  const { data } = props;
  const [sales, setSales] = useState<SalesTypePerMonth[]>();
  const colors = ["fe6484", "ff9e40", "ffcd56", "37a2eb"];

  useEffect(() => {
    setSales(data);
  }, [data]);
  // return necessary data;
  return { ...props, sales, colors };
};

export default useSaleType;
