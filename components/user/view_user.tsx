import React, { memo, useState } from "react";
import { Button, Col, Drawer, Flex, Row } from "antd";

import { UserWithAttendance } from "@/types";
import { UserProfilePlaceholder } from "../utilities";
import DailyTimeRecord from "./dtr_table";
import useLogs from "./user.hooks";
import dayjs from "dayjs";
import DeductionsErrors from "./deductions_errors";

interface MyProp extends UserWithAttendance {
  open: boolean;
  close: () => void;
}

const ViewUser = memo((prop: MyProp) => {
  const { user, open, close } = prop;

  const [selectedKey, setSelectedKey] = useState("dtr");
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());

  const [cutOff, setCutOff] = useState<"first" | "second">(
    dayjs().date() < 16 ? "first" : "second"
  );
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { logs, fetching, total, queryTime } = useLogs({
    type: "attendance",
    userId: user?._id,
    forcedSearchhWithUser: true,
    month: selectedMonth,
    fromDate:
      cutOff == "first"
        ? dayjs().month(selectedMonth).date(1).toDate()
        : dayjs().month(selectedMonth).date(16).toDate(),
    toDate:
      cutOff == "first"
        ? dayjs().month(selectedMonth).date(15).toDate()
        : dayjs()
            .month(selectedMonth)
            .date(dayjs().endOf("month").date())
            .toDate(),
    ...pagination,
  });

  const showContent = (key: string) => {
    switch (key) {
      case "dtr":
        return (
          <DailyTimeRecord
            loading={fetching}
            logs={logs}
            setMonth={setSelectedMonth}
            month={selectedMonth}
            total={total}
            pagination={pagination}
            setPagination={setPagination}
            cutOff={cutOff}
            setCutOff={setCutOff}
            time={queryTime}
          />
        );
      case "sde":
        return <DeductionsErrors user={user!} />;
      default:
        return <></>;
    }
  };

  return (
    <Drawer
      open={open}
      width={"85vw"}
      closable={false}
      onClose={() => {
        setSelectedMonth(dayjs().month());
        setCutOff(dayjs().date() < 16 ? "first" : "second");
        close();
      }}
      styles={{
        wrapper: {
          boxShadow: "none",
          marginTop: "6.5vh",
        },
        body: {
          padding: 0,
        },
        mask: {
          width: "88vw",
          float: "right",
        },
      }}
      destroyOnClose
    >
      <Row>
        <Col
          span={4}
          style={{
            background: "#98c04c",
            height: "93.5vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <UserProfilePlaceholder
            styles={{
              marginTop: 25,
            }}
          />

          <span
            style={{
              marginTop: 10,
              color: "#fff",
              fontSize: "1.5em",
              fontWeight: 700,
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            {user?.name}
          </span>
          <span
            style={{
              fontSize: "1.2em",
              marginTop: 5,
              color: "#fff",
              textAlign: "justify",
            }}
          >
            {user?.role.toLocaleUpperCase()}
          </span>
          <Flex vertical style={{ marginTop: 15, width: "100%" }}>
            <Button
              size="large"
              style={{
                width: "100%",
                borderRadius: 0,
                background: selectedKey == "dtr" ? "#294b0f" : "#98c04c",
                color: "#fff",
                border: "none",
              }}
              onClick={() => setSelectedKey("dtr")}
            >
              Daily Time Record
            </Button>
            <Button
              size="large"
              style={{
                width: "100%",
                borderRadius: 0,
                background: selectedKey == "sde" ? "#294b0f" : "#98c04c",
                color: "#fff",
                border: "none",
              }}
              onClick={() => setSelectedKey("sde")}
            >
              Deductions and Errors
            </Button>
          </Flex>
          <Button
            size="large"
            style={{
              color: "#fff",
              marginTop: "auto",
              border: "none",
              borderRadius: 0,
              background: "#7e7e7e",
            }}
            onClick={close}
            block
          >
            Back
          </Button>
        </Col>
        <Col span={20}>{showContent(selectedKey)}</Col>
      </Row>
    </Drawer>
  );
});

export default ViewUser;
