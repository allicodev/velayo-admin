import { useState } from "react";
import { FilterProps } from "./transaction.types";

const useFilter = () => {
  const [filter, setFilter] = useState<FilterProps>({
    status: "completed",
    type: null,
    tellerId: null,
    encoderId: null,
    sub_type: null,
    fromDate: null,
    toDate: null,
  });

  const onFilterUpdate = (type: string, value: any) =>
    setFilter({ ...filter, [type]: value });

  const handleOnResetFilter = () =>
    setFilter({
      status: "completed",
      type: null,
      tellerId: null,
      encoderId: null,
      sub_type: null,
      fromDate: null,
      toDate: null,
    });

  return { filter, updateFilter: onFilterUpdate, reset: handleOnResetFilter };
};

export default useFilter;
