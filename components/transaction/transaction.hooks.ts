import { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "@/provider/redux/hooks";

// service
import BillService from "@/provider/bill.service";
import BranchService from "@/provider/branch.service";
import UserService from "@/provider/user.service";

// redux
import { setTransactions } from "@/provider/redux/reducer/transactions.reducer";
import { setBranches } from "@/provider/redux/reducer/branch.reducer";
import { setUsers } from "@/provider/redux/reducer/user/user.reducer";

import { Transaction as TTransaction } from "@/types";
import { GetTransaction } from "./transaction.types";

// extra hooks
import useFilter from "./filter.hooks";

const useTransaction = () => {
  const dispatch = useDispatch();
  const [transactions, branch] = useSelector((state) => [
    state.transaction.data,
    state.branch.data,
  ]);
  const [total, setTotal] = useState(0); // TODO: Should be dynamically set to table component
  const { filter, updateFilter, reset } = useFilter();

  const [fetching, setFetching] = useState(false);
  const [width, setWidth] = useState(0);

  const isMobile = useMemo(() => width < 600, [width]);

  const getTransaction = async (
    props: GetTransaction
  ): Promise<TTransaction[] | any | void> =>
    new Promise(async (resolve, reject) => {
      let { status, updateTransact } = props;
      if (!updateTransact) updateTransact = true;

      setFetching(true);

      let res = await BillService.getAllTransaction({
        ...(props as any),
        ...filter,
        order: "descending",
        status: !_.isNil(status) ? [status] : null,
      });

      if (res?.success ?? false) {
        if (!updateTransact) {
          return resolve(res.data);
        }
        setFetching(false);
        dispatch(setTransactions(res?.data ?? []));
        setTotal(res.meta?.total ?? 10);
        resolve(res.data);
      } else {
        setFetching(false);
        reject();
      }
    });

  const getTotal = useCallback(() => {
    if (!_.isEmpty(transactions)) {
      const amount = transactions.reduce(
        (p: any, n: any) => p + (n?.amount ?? 0),
        0
      );
      const fee = _.filter(transactions, (e: any) => !_.isNil(e?.fee)).reduce(
        (p, n: any) => p + (n?.fee ?? 0),
        0
      );

      return { amount, fee };
    } else {
      return { amount: 0, fee: 0 };
    }
  }, [filter, transactions]);

  const tableProps = { dataSource: transactions, loading: fetching, total };
  const tableColumnProps = { isMobile };

  useEffect(() => {
    getTransaction({
      page: 1,
    });

    // get branch
    (async (_) => {
      let res = await _.getBranch({});

      if (res?.success ?? false) dispatch(setBranches(res?.data ?? []));
    })(BranchService);

    // get tellers
    (async (_) => {
      let res = await _.getUsers({
        page: 1,
        pageSize: 9999,
        role: ["teller", "encoder"],
      });

      if (res?.success ?? false)
        dispatch(setUsers({ type: "teller", data: res?.data ?? [] }));
    })(UserService);
  }, [filter]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // return necessary props;
  return {
    getTransaction,
    updateFilter,
    getTotal,
    filter,
    tableProps,
    tableColumnProps,

    // handlers
    resetFilter: reset,
  };
};

export default useTransaction;
