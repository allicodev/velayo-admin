import React from "react";
import { Button, Flex, Table, TableProps, Typography } from "antd";
import { DailyTimeRecord as DailtTimeRecordProp } from "@/types";
import dayjs from "dayjs";

const DailyTimeRecord = () => {
  const mock: DailtTimeRecordProp[] = [{ date: new Date() }];
  const getHeader = () => (
    <Flex style={{ marginTop: 10 }}>
      <Button>TEST</Button>
    </Flex>
  );

  const getTitle = () => (
    <Typography.Title level={4} style={{ margin: 0, marginTop: 25 }}>
      Daily Time Record
    </Typography.Title>
  );

  const columns: TableProps<DailtTimeRecordProp>["columns"] = [
    {
      dataIndex: "date",
      render: (_) => (
        <div
          style={{
            width: 50,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            background: "#294b0f",
            color: "#fff",
          }}
        >
          <span
            style={{
              fontSize: "0.8em",
            }}
          >
            {dayjs(_).format("ddd").toLocaleUpperCase()}
          </span>
          <span
            style={{
              fontSize: "1.5em",
              lineHeight: 1,
            }}
          >
            {dayjs(_).format("D")}
          </span>
          <span
            style={{
              fontSize: "0.8em",
            }}
          >
            {dayjs(_).format("MMM")}
          </span>
        </div>
      ),
    },
  ];
  return (
    <div style={{ padding: 8 }}>
      {getHeader()}
      {getTitle()}
      <Table
        style={{ marginTop: 5 }}
        columns={columns}
        dataSource={mock}
        rowClassName="no-padding"
        className="no-header"
      />
    </div>
  );
};

export default DailyTimeRecord;
