import { TableProps, Typography } from "antd";
import {
  useDispatch,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";
import _ from "lodash";

import { AccountFilters, AccountReceivable } from "./accountReceivables.types";
import { AppDispatch, RootState } from "@/provider/redux/store";
import { useEffect, useMemo, useState } from "react";
import { setAccounts } from "@/provider/redux/credit/credit.redux";

import CreditService from "@/provider/credit.service";
import { getAccountName } from "./accountReceivables.helpers";
import dayjs from "dayjs";

// service
import { UserThunkService } from "@/provider/redux";
import { useSelector } from "@/provider/redux/hooks";

const useAccountReceivable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState<AccountFilters>({
    id: null,
  });
  const [usersCredit, accounts] = useSelector((state) => [
    state.users.data,
    state.credit.accounts,
  ]);

  const columns: TableProps<AccountReceivable>["columns"] = [
    {
      title: "Name",
      dataIndex: "userId",
      render: (id) =>
        getAccountName(id, usersCredit?.credit ?? []) ?? (
          <Typography.Text type="secondary" italic>
            No Name
          </Typography.Text>
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) =>
        `₱${amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (description) => (
        <Typography.Paragraph style={{ width: 250 }} ellipsis>
          {description}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
  ];

  const fetchAccounts = async (id?: string | null) => {
    const { success, data } = await CreditService.getAccountReceivable(id);

    if (success ?? false) {
      if (_.isArray(data)) {
        dispatch(setAccounts(data as AccountReceivable[]));
      }
    }
  };

  const totalAmount = useMemo(() => {
    return (accounts || []).reduce(
      (p, n) => p + parseFloat(n.amount.toString()),
      0
    );
  }, [accounts]);

  useEffect(() => {
    if (_.isEmpty(usersCredit))
      dispatch(UserThunkService.getUser({ type: "credit" }));

    // if (_.isEmpty(accounts) || _.isNil(accounts))
    fetchAccounts(filter.id);
  }, [filter]);

  return { columns, accounts, totalAmount, setFilter };
};

export default useAccountReceivable;
