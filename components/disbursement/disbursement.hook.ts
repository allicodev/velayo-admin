import { useCallback, useEffect, useState } from "react";
import {
  useDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux";
import { message, TableProps } from "antd";
import _ from "lodash";

import { CashBoxColumn, LogData, User } from "@/types";
import { RootState } from "@/provider/redux/store";
import { setTellers } from "@/provider/redux/tellerSlice";
import UserService from "@/provider/user.service";
import dayjs from "dayjs";
import LogService from "@/provider/log.service";
import { updateFilter } from "@/provider/redux/filterSlice/filterSlice";
import { setLogs } from "@/provider/redux/logSlice/logSlice";

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

const useDisbursement = () => {
  const [reduxTeller, reduxFilter, reduxLogs] = useSelector(
    (state: RootState) => [state.teller.data, state.filter, state.logs]
  );

  const dispatch = useDispatch();

  const columns: TableProps<CashBoxColumn>["columns"] = [
    ...(_.isEmpty(reduxFilter.disbursement) ||
    reduxFilter.disbursement.teller == null
      ? [
          {
            title: "Name",
            width: 200,
            dataIndex: "name",
          },
        ]
      : [{}]),

    {
      title: "Type",
      align: "center",
      dataIndex: "type",
    },
    {
      title: "Amount",
      align: "center",
      dataIndex: "amount",
      render: (_) =>
        `₱${_.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Cash From",
      dataIndex: "cash_from",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      align: "center",
      render: (_) => dayjs(_).format("MMMM DD, YYYY - hh:mma"),
    },
  ];

  const getUsers = async () => {
    let {
      success,
      data,
      message: apiMessage,
    } = await UserService.getUsers({
      page: 1,
      pageSize: 9999,
      role: ["teller"],
    });

    if (success ?? false) {
      if (data) dispatch(setTellers(data));
    } else message.error(apiMessage ?? "Error in the Server");
  };

  const getDisbursementLogs = useCallback(
    () =>
      (reduxLogs.disbursement || []).map((e: LogData) => {
        const attr = JSON.parse(e.attributes ?? "{}");
        return {
          name: e?.userId?.name ?? "",
          type: e.subType,
          amount: e.amount ?? 0,
          reason: attr?.remarks ?? "",
          cash_from: attr?.cash_from ?? "",
          createdAt: e.createdAt,
        };
      }),
    [reduxFilter, reduxLogs]
  );
  const getDisbursement = useCallback(async () => {
    if (_.isEmpty(reduxFilter.disbursement)) return;
    console.log(reduxFilter);
    const {
      success,
      data,
      message: apiMessage,
    } = await LogService.getLog({
      page: 1,
      pageSize: 999,
      type: "disbursement",
      fromDate: reduxFilter?.disbursement?.fromDate ?? null,
      toDate: reduxFilter?.disbursement?.toDate ?? null,
      userId: reduxFilter?.disbursement?.teller ?? null,
    });

    if (success ?? false) {
      if (data) dispatch(setLogs({ key: "disbursement", logs: data }));
    } else message.error(apiMessage ?? "Error in the Server");
  }, [reduxFilter.disbursement]);

  useEffect(() => {
    // init filter for disbursement filter
    dispatch(
      updateFilter({
        key: "disbursement",
        value: {
          fromDate: dayjs().toISOString(),
          toDate: dayjs().toISOString(),
        },
      })
    );
  }, []);

  useEffect(() => {
    if (!(reduxTeller || []).length) getUsers();

    // always call the log per render
    getDisbursement();
  }, [reduxTeller, reduxFilter]);

  return { columns, data: getDisbursementLogs() };
};

export default useDisbursement;
