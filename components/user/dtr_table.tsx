import React, { useState } from "react";
import { Button, Dropdown, Space, Table, TableProps, Typography } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  TbClockExclamation,
  TbClockDown,
  TbClockBolt,
  TbClock,
} from "react-icons/tb";
import dayjs from "dayjs";

import { DTRCardTime, LogData } from "@/types";

import jason from "@/assets/json/constant.json";

interface MyProps {
  loading: boolean;
  logs: LogData[];
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  month: number;
  total: number;
  time: DTRCardTime;
  cutOff: "first" | "second";
  setCutOff: React.Dispatch<React.SetStateAction<"first" | "second">>;
  pagination: {
    page: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
}

const DailyTimeRecord = (props: MyProps) => {
  const {
    loading,
    logs,
    month,
    setMonth,
    pagination,
    setPagination,
    total,
    cutOff,
    setCutOff,
    time,
  } = props;

  const DTRCard = ({
    title,
    icon,
    time,
  }: {
    title: string;
    icon: any;
    time: string;
  }) => (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        border: "1px solid #eee",
        marginRight: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingRight: 15,
          paddingLeft: 15,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {icon}
        <span style={{ marginLeft: 5, lineHeight: 1, fontSize: "1.2em" }}>
          {title}
        </span>
      </div>
      <span style={{ fontSize: "1.5em" }}>{time}</span>
    </div>
  );

  const getHeader = () => {
    const calcTotal = () => {
      const minutes = time.total / 60;
      const _minute = Math.floor(minutes) % 60;
      const hours = Math.floor(minutes / 60);

      const totalSecsFromHour = hours > 0 ? hours * 60 * 60 : 0;
      const totalSecsFromMinutes = _minute == 0 ? 0 : _minute * 60;

      const seconds = time.total - (totalSecsFromHour + totalSecsFromMinutes);

      return `${hours > 0 ? (hours < 10 ? `0${hours}` : hours) : "00"}:${
        _minute == 0 ? "00" : _minute < 10 ? `0${_minute}` : _minute
      }:${seconds > 0 ? (seconds < 10 ? `0${seconds}` : seconds) : "00"}`;
    };
    return (
      <div style={{ display: "flex", marginTop: 8, marginBottom: 8 }}>
        <DTRCard
          title="TOTAL"
          icon={
            <TbClock
              style={{
                fontSize: "2em",
              }}
            />
          }
          time={calcTotal()}
        />
        <DTRCard
          title="LATE"
          icon={
            <TbClockExclamation
              style={{
                fontSize: "2em",
              }}
            />
          }
          time="00:00:00"
        />
        <DTRCard
          title="UNDERTIME"
          icon={
            <TbClockDown
              style={{
                fontSize: "2em",
              }}
            />
          }
          time="00:00:00"
        />
        <DTRCard
          title="OVERTIME"
          icon={
            <TbClockBolt
              style={{
                fontSize: "2em",
              }}
            />
          }
          time="00:00:00"
        />
      </div>
    );
  };

  const getTitle = () => {
    const getCutoffDate = () => {
      let date = dayjs().month(month);
      const _month = date.format("MMMM");

      return cutOff == "first"
        ? `${_month} 1 - ${_month} 15`
        : `${_month} 16 - ${_month} ${date.endOf("month").format("DD")}`;
    };
    return (
      <div
        style={{
          background: "#294b0f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            padding: 10,
            paddingLeft: 25,
            color: "#fff",
          }}
        >
          Daily Time Record
        </Typography.Title>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Space>
            <Button
              style={{
                width: 120,
                background: cutOff == "first" ? "#98c04c" : "#294b0f",
                border: cutOff == "second" ? "1px solid #98c04c" : undefined,
                color: cutOff == "second" ? "#fff" : undefined,
              }}
              type={cutOff == "first" ? "primary" : "default"}
              onClick={() => setCutOff("first")}
            >
              First CUT-OFF
            </Button>
            <Button
              style={{
                width: 120,
                background: cutOff == "second" ? "#98c04c" : "#294b0f",
                border: cutOff == "first" ? "1px solid #98c04c" : undefined,
                color: cutOff == "first" ? "#fff" : undefined,
              }}
              type={cutOff == "second" ? "primary" : "default"}
              onClick={() => setCutOff("second")}
            >
              Second CUT-OFF
            </Button>
          </Space>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: jason.months.map((e, index) => ({
                label: e,
                key: index,
              })),
              onClick: (e) => setMonth(parseInt(e.key)),
            }}
          >
            <Button
              style={{
                marginRight: 10,
                border: "1px solid #98c04c",
                color: "#fff",
                cursor: "pointer",
                background: "#294b0f",
              }}
            >
              <span
                style={{
                  fontSize: "1.2em",
                  fontFamily: "sans-serif",
                  fontWeight: 700,
                  marginRight: 10,
                }}
              >
                {getCutoffDate()}
              </span>
              <CaretDownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    );
  };
  const columns: TableProps<LogData>["columns"] = [
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 60,
      align: "center",
      render: (e) => dateRowCard(e),
    },
    {
      title: "first clocked-in",
      align: "center",
      width: 180,
      dataIndex: "flexiTime",
      render: (e) =>
        e != null && e.length > 0 ? (
          <span
            style={{
              fontWeight: 900,
              fontFamily: "sans-serif",
              letterSpacing: 0.8,
            }}
          >
            {dayjs(e[0].time).format("hh:mma")}
          </span>
        ) : (
          <Typography.Text type="secondary" italic>
            Not Applicable
          </Typography.Text>
        ),
    },
    {
      title: "last clocked-out",
      align: "center",
      width: 180,
      dataIndex: "flexiTime",
      render: (e) => {
        let timedOut = e.filter((_: any) => _.type == "time-out");

        return ![undefined, null].includes(timedOut) && timedOut.length > 0 ? (
          <span
            style={{
              fontWeight: 900,
              fontFamily: "sans-serif",
              letterSpacing: 0.8,
            }}
          >
            {dayjs(timedOut.at(-1)?.time).format("hh:mma")}
          </span>
        ) : (
          <Typography.Text type="secondary" italic>
            Not Yet
          </Typography.Text>
        );
      },
    },
    {
      title: "late",
      align: "center",
      width: 180,
      render: () => (
        <Typography.Text type="secondary" italic>
          Soon to be added
        </Typography.Text>
      ),
    },
    {
      title: "undertime",
      align: "center",
      width: 180,
      render: () => (
        <Typography.Text type="secondary" italic>
          Soon to be added
        </Typography.Text>
      ),
    },
    {
      title: "overtime",
      align: "center",
      width: 180,
      render: () => (
        <Typography.Text type="secondary" italic>
          Soon to be added
        </Typography.Text>
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
        dataSource={logs}
        rowClassName="no-padding"
        className="no-header"
        loading={loading}
        scroll={{
          y: "57vh",
          x: true,
        }}
        pagination={{
          total,
          current: pagination.page,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => setPagination({ page, pageSize }),
        }}
        bordered
      />
    </div>
  );
};

export default DailyTimeRecord;

const dateRowCard = (e: Date) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      justifyContent: "center",
      fontWeight: 700,
      paddingTop: 8,
      paddingBottom: 8,
    }}
  >
    <span
      style={{
        fontSize: "0.8em",
      }}
    >
      {dayjs(e).format("ddd").toLocaleUpperCase()}
    </span>
    <span
      style={{
        fontSize: "1.5em",
        lineHeight: 1,
        color: "#98c04c",
      }}
    >
      {dayjs(e).format("D")}
    </span>
    <span
      style={{
        fontSize: "0.8em",
      }}
    >
      {dayjs(e).format("MMM")}
    </span>
  </div>
);
