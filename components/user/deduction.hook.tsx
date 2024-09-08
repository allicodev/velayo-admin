import { useEffect, useState } from "react";
import { message, TableProps, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";

import { AutoDeductionsColumns, ErrorColumns } from "./user.types";
import { LogData, User } from "@/types";

import LogService from "@/provider/log.service";
import { useUserStore } from "@/provider/context";

const useDeductionsErrors = ({
  user,
  close,
}: {
  user: User;
  close: () => void;
}) => {
  const [logs, setLogs] = useState<LogData[]>([]); // errors
  const [logs2, setLogs2] = useState<LogData[]>([]); // cash advances
  const [loading, setLoading] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [cutOff, setCutOff] = useState<"first" | "second">();
  const [month, setMonth] = useState<number>(dayjs().month());

  const { currentUser } = useUserStore();

  const [input, setInput] = useState<{
    amount: number | null;
    remarks: string | null;
  }>({ amount: null, remarks: null });

  const [input2, setInput2] = useState<{
    amount: number | null;
    remarks: string | null;
    createdAt: Dayjs | null;
  }>({ amount: null, remarks: null, createdAt: null });

  const log = new LogService();

  const clearLoading = () => setLoading("");

  const updateInput = (key: string, value: any) =>
    setInput({ ...input, [key]: value });
  const updateInput2 = (key: string, value: any) =>
    setInput2({ ...input2, [key]: value });

  const column1: TableProps<AutoDeductionsColumns>["columns"] = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (e) =>
        `₱ ${e.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
    },
  ];

  const column2: TableProps<ErrorColumns>["columns"] = [
    {
      title: "Amount",
      dataIndex: "amount",
      render: (e) =>
        `₱ ${e.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      render: (e) => (
        <Typography.Text
          style={{
            maxWidth: "40vw",
          }}
          ellipsis={{ tooltip: e }}
        >
          {e}
        </Typography.Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 180,
      render: (e) => dayjs(e).format("MMM DD, YYYY hh:mma"),
    },
  ];

  const column3: TableProps<ErrorColumns>["columns"] = [
    {
      title: "Amount",
      dataIndex: "amount",
      render: (e) =>
        `₱ ${e.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      render: (e) => (
        <Typography.Text
          style={{
            maxWidth: "40vw",
          }}
          ellipsis={{ tooltip: e }}
        >
          {e}
        </Typography.Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 180,
      render: (e) => dayjs(e).format("MMM DD, YYYY hh:mma"),
    },
  ];

  const getLogs = async () => {
    setLoading("fetch");

    await Promise.all([
      (async () => {
        let {
          success,
          data,
          message: ApiMessage,
        } = await log.getLog({
          page: 1,
          pageSize: 9999999,
          type: "error",
          userId: user?._id ?? "",
          fromDate:
            cutOff == "first"
              ? dayjs().month(month).date(1).toDate()
              : dayjs().month(month).date(16).toDate(),
          toDate:
            cutOff == "first"
              ? dayjs().month(month).date(15).toDate()
              : dayjs()
                  .month(month)
                  .date(dayjs().endOf("month").date())
                  .toDate(),
        });

        if (success ?? false) {
          setLogs(data ?? []);
          clearLoading();
          Promise.resolve();
        } else Promise.reject(ApiMessage ?? "Error in the Server.");
      })(),
      (async () => {
        let {
          success,
          data,
          message: ApiMessage,
        } = await log.getLog({
          page: 1,
          pageSize: 9999999,
          type: "ca",
          userId: user?._id ?? "",
          fromDate:
            cutOff == "first"
              ? dayjs().month(month).date(1).toDate()
              : dayjs().month(month).date(16).toDate(),
          toDate:
            cutOff == "first"
              ? dayjs().month(month).date(15).toDate()
              : dayjs()
                  .month(month)
                  .date(dayjs().endOf("month").date())
                  .toDate(),
        });
        if (success ?? false) {
          setLogs2(data ?? []);
          clearLoading();
          Promise.resolve();
        } else Promise.reject(ApiMessage ?? "Error in the Server.");
      })(),
    ])
      .then(() => {})
      .catch((msg) => {
        message.error(msg ?? "Error in the Server.");
        clearLoading();
      });
  };

  const handleNewError = async () => {
    if (input.amount == 0 || input.amount == null) {
      message.error("Amount is empty");
      return;
    }

    const { success, message: ApiMessage } = await log.newLog({
      userId: user?._id ?? "",
      type: "error",
      ...input,
    });

    if (success ?? false) {
      message.success(ApiMessage ?? "Success");
      setTrigger(trigger + 1);
      setInput({ amount: null, remarks: null });
      close();
    } else {
      message.error(ApiMessage ?? "There is an error in the server");
    }
  };

  const handleNewCA = async () => {
    if (input2.amount == 0 || input2.amount == null) {
      message.error("Amount is empty");
      return;
    }

    const { success, message: ApiMessage } = await log.newLog({
      userId: user?._id ?? "",
      type: "ca",
      ...input2,
    });

    if (success ?? false) {
      message.success(ApiMessage ?? "Success");
      setTrigger(trigger + 1);
      setInput2({ amount: null, remarks: null, createdAt: null });
      close();
    } else {
      message.error(ApiMessage ?? "There is an error in the server");
    }
  };

  const getCutoffDate = () => {
    let date = dayjs().month(month);
    const _month = date.format("MMMM");

    return cutOff == "first"
      ? `${_month} 1 - ${_month} 15`
      : `${_month} 16 - ${_month} ${date.endOf("month").format("DD")}`;
  };

  useEffect(() => {
    getLogs();

    // setting cut-offs
    if (cutOff == null) setCutOff(dayjs().date() < 16 ? "first" : "second");
  }, [trigger, month, cutOff]);

  return {
    tableProps: {
      column1,
      column2,
      column3,
    },
    deductions: user?.deductions ?? [],
    newError: handleNewError,
    newCa: handleNewCA,
    loading,
    logs,
    ca: logs2,
    updateInput,
    updateInput2,
    cutOff,
    setCutOff,
    month,
    setMonth,
    cutOffDate: getCutoffDate(),
  };
};

export default useDeductionsErrors;
