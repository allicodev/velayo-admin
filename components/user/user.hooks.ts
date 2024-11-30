import LogService from "@/provider/log.service";
import { DTRCardTime, LogData, LogTime, LogType } from "@/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface MyProp {
  type: LogType;
  page?: number;
  pageSize?: number;
  userId?: string;
  fromDate?: Date;
  toDate?: Date;
  project?: Object;
  showImage?: boolean;
  month?: number;
  forcedSearchhWithUser?: boolean;
}

const useLogs = ({
  page = 1,
  pageSize = 10,
  forcedSearchhWithUser = false,
  type,
  ...rest
}: MyProp) => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [fetching, setFetching] = useState(false);
  const [total, setTotal] = useState(0);

  const [queryTime, setQueryTime] = useState<DTRCardTime>({
    total: 0,
    late: 0,
    undertime: 0,
    overtime: 0,
  });

  const calculateTime = (data: LogData[]) => {
    // * calculate the time based in minutes
    // * clean the logs first (remove the last if last time is type==time in)
    // * and merge it into one so they can alternate
    let cleanArr: LogTime[] = [];

    for (let i = 0; i < data.length; i++) {
      let log = data[i].flexiTime;

      if (
        (Array.isArray(log) &&
          log.length > 0 &&
          log.at(-1)?.type == "time-in") ||
        log.length == 1
      )
        log.pop();

      if (log.length > 1) log.forEach((item) => cleanArr.push(item));
    }

    // * total
    let _totalSeconds = 0;
    for (let i = 0; i < cleanArr.length; i += 2) {
      let item: LogTime = cleanArr[i];
      let item2: LogTime = cleanArr[i + 1];
      _totalSeconds += dayjs(item2.time).diff(dayjs(item.time), "second");
    }
    setQueryTime({ ...queryTime, total: _totalSeconds });

    // * need to add for LATE, UNDERTIME, OVERTIME
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (forcedSearchhWithUser && rest?.userId == null) return;

      setFetching(true);
      let { success, data, meta } = await LogService.getLog({
        page,
        pageSize,
        type: "attendance",
        showImage: false,
        ...rest,
      });

      if (success ?? false) {
        setLogs(data ?? []);
        setTotal(meta?.total ?? 0);
        calculateTime(data ?? []);
      }
      setFetching(false);
    };

    fetchLogs();
  }, [
    rest.userId,
    rest.month,
    page,
    pageSize,
    rest.toDate?.toDateString(),
    rest.fromDate?.toDateString(),
  ]);

  return { logs, fetching, total, queryTime };
};

export default useLogs;
