import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Image,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  TableProps,
  Typography,
  message,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import Excel from "exceljs";

import { LogData, LogTime, User } from "@/types";
import UserService from "@/provider/user.service";
import LogService from "@/provider/log.service";
import { useUserStore } from "@/provider/context";

// TODO: validate duplicate employee ID

interface FilterProps {
  tellerId?: string | null;
  fromDate?: Dayjs | null;
  toDate?: Dayjs | null;
  showImage?: boolean;
}

const Attendance = () => {
  const [tellers, setTellers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState<FilterProps>({
    tellerId: null,
    fromDate: null,
    toDate: null,
    showImage: false,
  });
  const [photoViewer, setPhotoViewer] = useState<{
    open: boolean;
    src: string | undefined;
    details?: string;
  }>({ open: false, src: "", details: undefined });
  const [tellerName, setTellerName] = useState(null);

  const { currentUser } = useUserStore();

  const [total, setTotal] = useState(0);
  const [totalRenderedHourse, setTotalRenderedHours] = useState(0);
  const [width, setWidth] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);

  // context and services
  const user = new UserService();
  const log = new LogService();

  const isMobile = width < 600;

  const showFlexiTime = (_: LogTime[], __: LogData) => {
    let time = _.reduce((p: any, n: LogTime, index: any) => {
      if (index % 2 === 0) p.push([n]);
      else p[p.length - 1].push(n);
      return p;
    }, []);

    const getDetails = () => {
      if (__?.branchId?.name != null)
        return `Taken in Branch ${__?.branchId?.name ?? ""} at ${dayjs(
          __?.createdAt
        ).format("MMMM DD, YYYY")}`;
      return `Taken at ${dayjs(__?.createdAt).format("MMMM DD, YYYY")}`;
    };

    return (
      <div
        style={{
          textAlign: "start",
          display: "grid",
          placeItems: "center",
        }}
      >
        {time.map((e: LogTime[]) => (
          <>
            <div style={{ display: "inline-block" }}>
              {filter.showImage && e[0].photo != null ? (
                <Typography.Link
                  onClick={() =>
                    setPhotoViewer({
                      open: true,
                      src: e[0].photo,
                      details:
                        (currentUser?.role ?? "") == "admin"
                          ? getDetails()
                          : "",
                    })
                  }
                >
                  {dayjs(e[0].time).format("hh:mma")}
                </Typography.Link>
              ) : (
                <span>{dayjs(e[0].time).format("hh:mma")}</span>
              )}

              {e.length > 1 && e[1].type == "time-out" ? (
                filter.showImage && e[0].photo != null ? (
                  <Typography.Link
                    onClick={() =>
                      setPhotoViewer({
                        open: true,
                        src: e[1].photo,
                        details:
                          (currentUser?.role ?? "") == "admin"
                            ? getDetails()
                            : "",
                      })
                    }
                  >
                    {` - ${dayjs(e[1].time).format("hh:mma")}`}
                  </Typography.Link>
                ) : (
                  ` - ${dayjs(e[1].time).format("hh:mma")}`
                )
              ) : null}
            </div>
          </>
        ))}
      </div>
    );
  };

  const showFlexiTimeRaw = (_: LogTime[]) => {
    let time = _.reduce((p: any, n: LogTime, index: any) => {
      if (index % 2 === 0) p.push([n]);
      else p[p.length - 1].push(n);
      return p;
    }, []);

    return time
      .map(
        (e: LogTime[]) =>
          `${dayjs(e[0].time).format("hh:mma")} ${
            e.length > 1 && e[1].type == "time-out"
              ? "- " + dayjs(e[1].time).format("hh:mma")
              : ""
          }`
      )
      .join("\n");
  };

  const columns: TableProps<LogData>["columns"] = [
    {
      title: "ID",
      dataIndex: "userId",
      width: isMobile ? 120 : undefined,
      render: (_) => _.employeeId,
    },
    {
      title: "User",
      width: isMobile ? 120 : undefined,
      align: "center",
      render: (_, { userId }) => <div>{userId.name.toLocaleUpperCase()} </div>,
    },
    {
      title: "Type",
      dataIndex: "userId",
      width: isMobile ? 120 : undefined,
      render: (_) => _.role.toLocaleUpperCase(),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: isMobile ? 120 : undefined,
      render: (_) => dayjs(_).format("MMMM DD, YYYY"),
    },
    {
      title: "Time Records",
      align: "center",
      dataIndex: "flexiTime",
      render: (_, data) => showFlexiTime(_, data),
    },
    {
      title: "Hour(s) Rendered",
      align: "center",
      fixed: "right",
      dataIndex: "flexiTime",
      width: isMobile ? 85 : undefined,
      render: (_) =>
        _.length <= 1 ? (
          <Typography.Text type="secondary" italic>
            N/A
          </Typography.Text>
        ) : (
          <span>{calculateHoursRendered(_).toFixed(2)}</span>
        ),
    },
  ];

  const getHeaderMobile = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <Button
          type="primary"
          size="large"
          icon={<SettingOutlined />}
          onClick={() => setOpenFilter(true)}
        >
          Filter Options
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            (async () => {
              await getLogs({
                page: 1,
                pageSize: 99999999,
                userId: filter.tellerId ?? "",
                fromDate: filter.fromDate ?? null,
                toDate: filter.toDate ?? null,
              }).then((e) => {
                if (typeof e == "object" && e.length > 0) exportExcel(e);
              });
            })();
          }}
        >
          EXPORT
        </Button>
      </div>
    );
  };

  const getHeader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Select
          size="large"
          style={{ width: 250 }}
          placeholder="Select a Teller"
          value={tellerName}
          options={tellers.map((e) => ({
            label: `[${e.role.toLocaleUpperCase()}] ${e.name}`,
            value: e.name,
            key: e._id,
          }))}
          onChange={(_, e: any) => {
            setFilter({ ...filter, tellerId: e?.key ?? null });
            setTellerName(e.label.split("]")[1]);
          }}
          filterOption={(
            input: string,
            option?: { label: string; value: string }
          ) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          showSearch
        />
        <Divider type="vertical" />
        <DatePicker.RangePicker
          size="large"
          format="MMMM DD, YYYY"
          placeholder={["From Date", "To Date"]}
          onChange={(e) => {
            setFilter({
              ...filter,
              fromDate: e ? e[0] : null,
              toDate: e ? e[1] : null,
            });
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setFilter({ ...filter, showImage: !filter.showImage })}
      >
        <Switch
          checkedChildren="Show Photos"
          unCheckedChildren="Hide Photos"
          defaultChecked={false}
          value={filter.showImage}
        />
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          (async () => {
            await getLogs({
              page: 1,
              pageSize: 99999999,
              userId: filter.tellerId ?? "",
              fromDate: filter.fromDate ?? null,
              toDate: filter.toDate ?? null,
            }).then((e) => {
              if (typeof e == "object" && e.length > 0) exportExcel(e);
            });
          })();
        }}
      >
        EXPORT
      </Button>
    </div>
  );

  const calculateHoursRendered = (_: LogTime[]): number => {
    let time = _.reduce((p: any, n: LogTime, index: any) => {
      if (_.length == 1) p.push(n);
      else if (index % 2 === 0) p.push([n]);
      else p[p.length - 1].push(n);
      return p;
    }, []).filter((e: any) => e.length > 1);

    let renderedHours = time
      .map((e: LogTime[]) => {
        let hours = dayjs(e[1].time).diff(dayjs(e[0].time), "hour");
        let min =
          Math.abs(dayjs(e[1].time).minute() - dayjs(e[0].time).minute()) / 60;

        return hours + min;
      })
      .reduce((p: number, n: number) => p + n, 0);

    return renderedHours;
  };

  const getLogs = async ({
    page,
    pageSize,
    userId,
    fromDate,
    toDate,
    project,
    updateLogs = true,
    showImage = false,
    fetchTotalTimer = false,
  }: {
    page: number;
    pageSize?: number;
    userId?: string | null;
    fromDate?: Dayjs | null;
    toDate?: Dayjs | null;
    project?: Record<any, any>;
    updateLogs?: boolean;
    showImage?: boolean | null;
    fetchTotalTimer?: boolean | null;
  }): Promise<LogData[] | any | void> =>
    new Promise(async (resolve, reject) => {
      setFetching(true);
      if (!pageSize) pageSize = 10;

      let res = await log.getLog({
        page,
        pageSize,
        type: "attendance",
        userId,
        fromDate,
        toDate,
        project,
        showImage,
        fetchTotalTimer,
      });

      if (res?.success ?? false) {
        if (!updateLogs) {
          return resolve(res.data);
        }

        setFetching(false);
        setLogs(res?.data ?? []);
        setTotal(res.meta?.total ?? 10);

        if (fetchTotalTimer)
          setTotalRenderedHours(
            res?.meta?.timers.reduce((p: any, n: any) => {
              if (n.timeOut == null) return p;
              let hours = dayjs(n.timeOut).diff(dayjs(n.timeIn), "hour");
              let minutes =
                Math.abs(dayjs(n.timeOut).minute() - dayjs(n.timeIn).minute()) /
                60;
              return p + hours + minutes;
            }, 0)
          );
        resolve(res.data);
      } else {
        setFetching(false);
        reject();
      }
    });

  const exportExcel = (_logs: LogData[]) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");

    // * set the first row to be the title uwu :3
    sheet.mergeCells("A1:G1");
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A1").font = {
      family: 4,
      size: 18,
      bold: true,
    };
    sheet.getCell("A1").value = "Attendance Report";
    sheet.getRow(2).values = [
      "ID",
      "Employee Name",
      "Role",
      "Date",
      "Time Record",
      "Hour(s) Rendered",
    ];
    sheet.properties.defaultRowHeight = 20;

    sheet.columns = [
      {
        key: "employeeId",
        width: 15,
      },
      {
        key: "userId",
        width: 30,
      },
      {
        key: "type",
        width: 15,
      },
      {
        key: "date",
        width: 22,
      },
      {
        key: "timeRecord",
        width: 30,
      },
      {
        key: "renderedHours",
        width: 25,
      },
    ];

    _logs.map((e) => {
      sheet.addRow({
        employeeId: e.userId.employeeId,
        userId: e.userId.name
          .split(" ")
          .map((e) => `${e[0].toLocaleUpperCase()}${e.slice(1)}`)
          .join(" "),
        type: e.userId.role.toLocaleUpperCase(),
        date: dayjs(e?.createdAt).format("MM/DD/YYYY"),
        timeRecord: showFlexiTimeRaw(e.flexiTime),
        renderedHours:
          e.flexiTime.length <= 1
            ? ""
            : calculateHoursRendered(e.flexiTime).toFixed(2),
      });
    });

    let s = (str: string) =>
      sheet.getCell(`${str.toLocaleUpperCase()}${_logs.length + 3}`);
    s("f").font = {
      family: 4,
      size: 12,
    };
    s("f").value = "TOTAL";
    s("g").font = {
      family: 4,
      size: 14,
      bold: true,
    };

    let total = 0;

    for (let i = 0; i < _logs.length; i++) {
      let item = _logs[i];

      if (item.flexiTime.length > 1) {
        total += calculateHoursRendered(item.flexiTime);
      }
    }

    s("g").value = total.toFixed(2);

    // * styles the headers and lower cells
    for (let i = 0; i < _logs.length + 1; i++) {
      ["A", "B", "C", "D", "E", "F", "G"].map((c) => {
        sheet.getCell(`${c}${i + 2}`).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        if (i == 0)
          sheet.getCell(`${c}2`).font = {
            family: 4,
            size: 12,
            bold: true,
          };
      });
    }

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ATTENDANCE-REPORT-${dayjs().format("MM/DD/YYYY")}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("Exported to Excel successfully");
    });
  };

  useEffect(() => {
    // get tellers
    (async (_) => {
      let res = await _.getUsers({
        page: 1,
        pageSize: 9999,
        notRole: ["admin"],
      });

      if (res?.success ?? false) setTellers((res?.data as User[]) ?? []);
    })(user);

    getLogs({
      page: 1,
      userId: filter.tellerId ?? null,
      fromDate: filter.fromDate ?? null,
      toDate: filter.toDate ?? null,
      showImage: filter.showImage ?? null,
    });
  }, [filter]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <Table
        title={isMobile ? getHeaderMobile : getHeader}
        columns={columns}
        loading={fetching}
        dataSource={logs}
        rowKey={(e) => e._id ?? ""}
        scroll={{
          y: "calc(100vh - 30em)",
          x: isMobile ? "200vw" : undefined,
        }}
        pagination={{
          defaultPageSize: 10,
          total,
          onChange: (page, pageSize) =>
            getLogs({
              page,
              pageSize,
              userId: filter.tellerId ?? null,
              fromDate: filter.fromDate ?? null,
              toDate: filter.toDate ?? null,
              showImage: filter.showImage ?? null,
            }),
        }}
        sticky
        bordered
      />

      {/* context */}
      <Image
        width={200}
        style={{ display: "none" }}
        alt="no-image"
        preview={{
          visible: photoViewer.open,
          src: photoViewer.src,
          title: (
            <div
              style={{
                background: "#eee",
                borderRadius: 4,
                display: "inline-block",
                padding: "2px 3px",
              }}
            >
              {photoViewer.details ?? ""}
            </div>
          ),
          onVisibleChange: (value) => {
            setPhotoViewer({ ...photoViewer, open: value });
          },
        }}
      />
      <Modal
        open={openFilter}
        onCancel={() => setOpenFilter(false)}
        closable={false}
        footer={
          <Space>
            <Button
              size="large"
              onClick={() => {
                setFilter({
                  tellerId: null,
                  fromDate: null,
                  toDate: null,
                });
                setOpenFilter(false);
                message.success("Filter cleared");
              }}
            >
              RESET
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setOpenFilter(false);
                message.success("Filter applied");
              }}
            >
              APPLY FILTER
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Space size={[32, 32]} direction="vertical">
          <Select
            size="large"
            style={{ width: 250 }}
            placeholder="Select a Teller"
            value={tellerName}
            options={tellers.map((e) => ({
              label: `[${e.role.toLocaleUpperCase()}] ${e.name}`,
              value: e.name,
              key: e._id,
            }))}
            onChange={(_, e: any) => {
              setFilter({ ...filter, tellerId: e?.key ?? null });
              setTellerName(e.label.split("]")[1]);
            }}
            filterOption={(
              input: string,
              option?: { label: string; value: string }
            ) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
            showSearch
          />
          <DatePicker.RangePicker
            size="large"
            format="MMMM DD, YYYY"
            onChange={(e) => {
              setFilter({
                ...filter,
                fromDate: e ? e[0] : null,
                toDate: e ? e[1] : null,
              });
            }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default Attendance;
