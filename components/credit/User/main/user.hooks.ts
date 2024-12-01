import { useCallback, useEffect, useState } from "react";
import _ from "lodash";

// services
import { LogThunkService, CreditThunkService } from "@/provider/redux";

// helpers
import { processWithTotal } from "./user.helpers";

import { useDispatch, useSelector } from "@/provider/redux/hooks";
import { UserCredit, UserCreditData } from "@/types";
import dayjs from "dayjs";
import CreditService from "@/provider/credit.service";
import { message } from "antd";

const useUser = () => {
  const dispatch = useDispatch();
  const [reduxUser, reduxLog] = useSelector((state) => [
    state.users,
    state.logs.data,
  ]);

  const [trigger, setTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserCreditData | null>(null);
  const [editUser, setEditUser] = useState<{
    open: boolean;
    user: UserCreditData | null;
  }>({ open: false, user: null });

  // * mobile
  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

  const refresh = () => setTrigger(trigger + 1);

  const getCreditLog = useCallback(
    () =>
      (reduxUser.data["credit"] ?? []).sort((a: any, b: any) =>
        dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
      ) ?? [],
    [reduxUser.data["credit"]]
  );

  const getLogs = useCallback(() => {
    // sort via date
    let _logs = _.sortBy(reduxLog ?? [], (item) =>
      dayjs(item.createdAt).toDate()
    );

    // sort again via status
    _logs = _.orderBy(_logs, [(item) => item.status], ["asc"]);

    // Move 'pending' status to the top
    _logs = _.orderBy(
      _logs,
      [(item) => (item.status === "pending" ? 0 : 1)],
      ["asc"]
    );

    return _logs;
  }, [reduxUser.data["credit"]]);

  const handleNewUser = async (user: UserCredit) => {
    if (editUser.user != null) {
      let res = await CreditService.updateCreditUser(user);

      if (res?.success ?? false) {
        message.success(res?.message ?? "Success");
        refresh();
        return true;
      } else {
        message.error(res?.message ?? "Error");
        return false;
      }
    }
    let res = await CreditService.newCreditUser(user);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      refresh();
      return true;
    } else {
      message.error(res?.message ?? "Error");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    let res = await CreditService.deleteCreditUser(id);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      refresh();
    } else message.error(res?.message ?? "Error");
  };

  const openLogs = (id: string) =>
    dispatch(
      LogThunkService.getLogs({
        page: 1,
        pageSize: 99999,
        type: "credit",
        userCreditId: id,
      })
    );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const users = reduxUser.data["credit"] || [];

    if (_.isArray(users) && !_.isEmpty(users)) {
      if (!isMobile) setSelectedUser(processWithTotal(users[0]));
      dispatch(
        LogThunkService.getLogs({
          page: 1,
          pageSize: 99999,
          type: "credit",
          userCreditId: users[0]._id,
        })
      );
    }
  }, [reduxUser.data]);

  useEffect(() => {
    dispatch(CreditThunkService.getUserCredit({}));
  }, []);
  // return necessary data
  return {
    users: reduxUser.data["credit"] || [],
    selectedUser,
    isMobile,
    editUser,
    openLogs,
    getCreditLog,
    getLogs,
    setEditUser,
    setSelectedUser,
    handleNewUser,
    handleDelete,
  };
};

export default useUser;
