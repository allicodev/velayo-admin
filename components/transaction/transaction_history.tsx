import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
  message,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Excel from "exceljs";

import {
  Transaction,
  User,
  TransactionHistoryStatus,
  BranchData,
  TransactionType,
  Branch,
} from "@/types";
import dayjs, { Dayjs } from "dayjs";
import BillService from "@/provider/bill.service";
import BranchService from "@/provider/branch.service";
import UserService from "@/provider/user.service";

interface FilterProps {
  status?: TransactionHistoryStatus | null;
  type?: TransactionType | null;
  tellerId?: string | null;
  encoderId?: string | null;
  sub_type?: string | null;
  fromDate?: Dayjs | null;
  toDate?: Dayjs | null;
}

interface TotalProps {
  amount: number;
  fee: number;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tellers, setTellers] = useState<User[]>([]);
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [fetching, setFetching] = useState(false);
  const [tellerName, setTellerName] = useState("");
  const [width, setWidth] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);

  const isMobile = width < 600;

  const [filter, setFilter] = useState<FilterProps>({
    status: "completed",
    type: null,
    tellerId: null,
    encoderId: null,
    sub_type: null,
    fromDate: null,
    toDate: null,
  });

  const [totalOpt, setTotalOpt] = useState<TotalProps>({ amount: 0, fee: 0 });

  const [total, setTotal] = useState(0);

  const bill = new BillService();
  const branch = new BranchService();
  const user = new UserService();

  const column: TableProps<Transaction>["columns"] = [
    {
      title: "Ref Code",
      width: isMobile ? 30 : 100,
      dataIndex: "reference",
    },
    {
      title: "Branch Name",
      dataIndex: "branchId",
      width: isMobile ? 25 : 70,
      render: (_) => (_ as BranchData)?.name ?? _,
    },
    {
      title: "Date/Time",
      width: isMobile ? 25 : 70,
      dataIndex: "createdAt",
      align: "center",
      render: (_) => dayjs(_).format("MM/DD/YYYY HH:mm"),
    },
    {
      title: isMobile ? "Type" : "Transaction Type",
      width: isMobile ? 25 : 90,
      align: isMobile ? "center" : "start",
      dataIndex: "type",
    },
    {
      title: "Biller Name / Product Code",
      width: isMobile ? 38 : 150,
      dataIndex: "sub_type",
      render: (_) =>
        _ ?? (
          <Typography.Text type="secondary" italic>
            Not Applicable
          </Typography.Text>
        ),
    },
    {
      title: "Amount",
      width: isMobile ? 20 : 100,
      align: "end",
      render: (_, row) =>
        row.type == "miscellaneous" ||
        (row.type == "wallet" &&
          row.sub_type?.toLocaleLowerCase().includes("cash-out"))
          ? (row.amount ?? 0) + (row.fee ?? 0)
          : row.amount,
    },
    {
      title: isMobile ? "Fee" : "Service Fee",
      align: "end",
      width: isMobile ? 20 : 100,
      dataIndex: "fee",
      render: (_) => _?.toFixed(2) ?? "0.00",
    },
    {
      title: "Amount + S.Fee",
      align: "end",
      width: isMobile ? 30 : 100,
      render: (_, e) =>
        ((e.amount ?? 0) +
          (e.type == "wallet" &&
          e.sub_type?.toLocaleLowerCase().includes("cash-out")
            ? e.fee ?? 0
            : 0)) *
          (e.type == "wallet" &&
          e.sub_type?.toLocaleLowerCase().includes("cash-out")
            ? -1
            : 1) +
        (e.fee ?? 0),
    },
    {
      title: "Teller",
      align: "center",
      width: isMobile ? 35 : 100,
      dataIndex: "tellerId",
      render: (_) => (_ as User)?.name ?? _,
    },
    {
      title: "Status",
      width: isMobile ? 25 : 100,
      align: "center",
      fixed: "right",
      render: (_, row) => {
        let status = row?.history.at(-1)?.status;
        return (
          <Tag
            color={
              status == "completed"
                ? "green-inverse"
                : status == "pending"
                ? "orange-inverse"
                : "red-inverse"
            }
          >
            {status?.toLocaleUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const getHeader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Space size={[32, 0]}>
        <Select
          size="large"
          style={{ width: 150 }}
          placeholder="Select a Teller"
          value={tellerName}
          options={tellers.map((e) => ({
            label: `[${e.role.toLocaleUpperCase()}] ${e.name}`,
            value: e.name,
            key: `${e._id}_${e.role}`,
          }))}
          onChange={(_, e: any) => {
            // setFilter({ ...filter, tellerId: e?.key ?? null });
            if (e) {
              let [id, role] = e?.key.split("_");
              setFilter({
                ...filter,
                [role == "teller" ? "tellerId" : "encoderId"]: id ?? null,
              });
            } else {
              setFilter({ ...filter, tellerId: null, encoderId: null });
            }

            setTellerName(e?.label.split("]")[1]);
          }}
          allowClear
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
        <Select
          size="large"
          style={{ width: 200 }}
          placeholder="Select a Transaction Type"
          options={["bills", "wallet", "eload", "miscellaneous", "shopee"].map(
            (e) => ({
              label: e.toLocaleUpperCase(),
              value: e,
            })
          )}
          onChange={(_, e: any) =>
            setFilter({ ...filter, type: e?.value ?? null })
          }
          allowClear
        />
        <Select
          size="large"
          style={{ width: 120 }}
          placeholder="Select a Status"
          value={filter.status}
          options={["completed", "failed", "pending"].map((e) => ({
            label: e.toLocaleUpperCase(),
            value: e,
          }))}
          onChange={(_, e: any) =>
            setFilter({ ...filter, status: e?.value ?? null })
          }
          allowClear
        />
        <Input
          size="large"
          style={{ width: 200 }}
          placeholder="Search a Biller"
          onChange={(e) => setFilter({ ...filter, sub_type: e.target.value })}
          allowClear
        />
      </Space>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          (async () => {
            await getTransaction({
              page: 1,
              pageSize: 99999999,
              tellerId: filter.tellerId ?? "",
              type: filter.type ?? undefined,
              status: filter.status,
              sub_type: filter.sub_type ?? null,
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
              await getTransaction({
                page: 1,
                pageSize: 99999999,
                tellerId: filter.tellerId ?? "",
                type: filter.type ?? undefined,
                status: filter.status,
                sub_type: filter.sub_type ?? null,
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

  const getTransaction = async ({
    page,
    pageSize,
    tellerId,
    encoderId,
    branchId,
    type,
    status,
    sub_type,
    updateTransact = true,
    project,
    fromDate,
    toDate,
  }: {
    page: number;
    pageSize?: number;
    tellerId?: string;
    encoderId?: string;
    branchId?: string;
    type?: TransactionType | null;
    status?: TransactionHistoryStatus | null;
    sub_type?: string | null;
    updateTransact?: boolean;
    project?: Record<any, any>;
    fromDate?: Dayjs | null;
    toDate?: Dayjs | null;
  }): Promise<Transaction[] | any | void> =>
    new Promise(async (resolve, reject) => {
      setFetching(true);
      if (!pageSize) pageSize = 10;

      let res = await bill.getAllTransaction({
        page,
        pageSize,
        order: "descending",
        tellerId,
        encoderId,
        branchId,
        type,
        status: status ? [status] : null,
        sub_type,
        project,
        fromDate,
        toDate,
      });

      if (res?.success ?? false) {
        if (!updateTransact) {
          return resolve(res.data);
        }
        setFetching(false);
        setTransactions(res?.data ?? []);
        setTotal(res.meta?.total ?? 10);
        resolve(res.data);
      } else {
        setFetching(false);
        reject();
      }
    });

  const updateTotalCalculate = async () => {
    let totals = await getTransaction({
      page: 1,
      pageSize: 999999999999,
      tellerId: filter.tellerId ?? "",
      type: filter.type ?? undefined,
      status: filter.status,
      sub_type: filter.sub_type ?? null,
      updateTransact: false,
      fromDate: filter.fromDate ?? null,
      toDate: filter.toDate ?? null,
      project: {
        amount: 1,
        fee: 1,
        sub_type: 1,
        type: 1,
        branchId: 0,
        tellerId: 0,
        _id: 0,
      },
    });

    if (totals && totals.length > 0) {
      setTotalOpt({
        amount: totals.reduce((p: any, n: any) => p + n.amount, 0),
        fee: totals
          .filter((e: any) => e?.fee != undefined)
          .reduce((p: any, n: any) => p + n?.fee ?? 0, 0),
      });
    } else {
      setTotalOpt({ amount: 0, fee: 0 });
    }
  };

  const exportExcel = (trans: Transaction[]) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");

    // * set the first row to be the title uwu :3
    sheet.mergeCells("A1:J1");
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A1").font = {
      family: 4,
      size: 18,
      bold: true,
    };
    sheet.getCell("A1").value = "Transaction Report";
    sheet.getRow(2).values = [
      "Ref Code",
      "Branch Name",
      "Date/Time",
      "Transaction Type",
      "Biller Name / Product Code",
      "Amount",
      "Service Fee",
      "Amount + Service Fee",
      "User",
      "Status",
    ];
    sheet.properties.defaultRowHeight = 20;

    const getTransactionLabel = (c: TransactionType): string => {
      switch (c) {
        case "bills":
          return "Bills Payment";
        case "eload":
          return "E-Load";
        case "wallet":
          return "Online Wallet";
        case "shopee":
          return "Shoppe Self Collect";
        case "miscellaneous":
          return "miscellaneous";
      }
    };

    // Design the header chuyyy
    sheet.columns = [
      {
        key: "refCode",
        width: 30,
      },
      {
        key: "branchName",
        width: 20,
      },
      {
        key: "dateTime",
        width: 20,
      },
      {
        key: "transactionType",
        width: 20,
      },
      {
        key: "billerName",
        width: 30,
      },
      {
        key: "amount",
        width: 15,
      },
      {
        key: "serviceFee",
        width: 15,
      },
      {
        key: "total",
        width: 23,
      },
      {
        key: "user",
        width: 25,
      },
      {
        key: "status",
        width: 12,
      },
    ];

    trans.map((e) => {
      sheet.addRow({
        refCode: e.reference,
        branchName: (e.branchId as Branch)?.name ?? "No Branch",
        dateTime: dayjs(e.createdAt).format("MM/DD/YYYY HH:mm"),
        transactionType: getTransactionLabel(e.type),
        billerName: e.sub_type?.toLocaleUpperCase() ?? "N/A",
        amount:
          e.type == "miscellaneous" ||
          (e.type == "wallet" &&
            e.sub_type?.toLocaleLowerCase().includes("cash-out"))
            ? (e.amount ?? 0) + (e.fee ?? 0)
            : e.amount,
        serviceFee: e.fee,
        total:
          ((e.amount ?? 0) +
            (e.type == "wallet" &&
            e.sub_type?.toLocaleLowerCase().includes("cash-out")
              ? e.fee ?? 0
              : 0)) *
            (e.type == "wallet" &&
            e.sub_type?.toLocaleLowerCase().includes("cash-out")
              ? -1
              : 1) +
          (e.fee ?? 0),
        user: typeof e.tellerId == "object" ? e.tellerId.name : "",
        status: (e.history.at(-1)?.status ?? "").toLocaleUpperCase(),
      });
    });

    let s = (str: string) =>
      sheet.getCell(`${str.toLocaleUpperCase()}${trans.length + 3}`);
    s("e").font = {
      family: 4,
      size: 14,
      bold: true,
    };
    s("e").value = "TOTAL";
    s("f").alignment = {
      horizontal: "right",
    };
    s("g").alignment = {
      horizontal: "right",
    };
    s("h").alignment = {
      horizontal: "right",
    };

    const totalAmount = trans.reduce((p, n) => p + (n.amount ?? 0), 0);
    const totalFee = trans.reduce((p, n) => p + (n?.fee ?? 0), 0);

    const parseToMoney = (num: number) =>
      num
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    s("f").value = parseToMoney(totalAmount);
    s("g").value = parseToMoney(totalFee);
    s("h").value = parseToMoney(totalAmount + totalFee);

    // * styles the headers
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((c) => {
      sheet.getCell(`${c}2`).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheet.getCell(`${c}2`).font = {
        family: 4,
        size: 12,
        bold: true,
      };
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `REPORT-${dayjs().format("MM/DD/YYYY")}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("Exported to Excel successfully");
    });
  };

  useEffect(() => {
    getTransaction({
      page: 1,
      tellerId: filter.tellerId ?? "",
      encoderId: filter.encoderId ?? "",
      type: filter.type ?? undefined,
      status: filter.status,
      sub_type: filter.sub_type ?? null,
      fromDate: filter.fromDate ?? null,
      toDate: filter.toDate ?? null,
    });

    // get branch
    (async (_) => {
      let res = await _.getBranch({});

      if (res?.success ?? false) setBranches(res?.data ?? []);
    })(branch);

    // get tellers
    (async (_) => {
      let res = await _.getUsers({
        page: 1,
        pageSize: 9999,
        role: ["teller", "encoder"],
      });

      if (res?.success ?? false) setTellers((res?.data as User[]) ?? []);
    })(user);

    // recalculate total
    updateTotalCalculate();
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
    <>
      <Table
        title={isMobile ? getHeaderMobile : getHeader}
        columns={column}
        loading={fetching}
        dataSource={transactions}
        rowKey={(e) => e._id ?? ""}
        style={{
          padding: 10,
        }}
        scroll={{
          y: "calc(100vh - 25em)",
          x: isMobile ? "300vw" : undefined,
        }}
        pagination={{
          defaultPageSize: 10,
          total,
          onChange: (page, pageSize) =>
            getTransaction({
              page,
              pageSize,
              tellerId: filter.tellerId ?? "",
              type: filter.type ?? null,
              status: filter.status ?? null,
              sub_type: filter.sub_type ?? null,
              fromDate: filter.fromDate ?? null,
              toDate: filter.toDate ?? null,
            }),
        }}
        summary={(pageData) => (
          <Table.Summary fixed>
            {isMobile ? (
              <></>
            ) : (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.1em",
                    }}
                  >
                    <span style={{ marginRight: 5 }}>TOTAL:</span>
                    <span style={{ fontWeight: 900 }}>
                      {totalOpt.amount
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.1em",
                    }}
                  >
                    <span style={{ marginRight: 5 }}>TOTAL:</span>
                    <span style={{ fontWeight: 900 }}>
                      {totalOpt.fee
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.1em",
                    }}
                  >
                    <span style={{ marginRight: 5 }}>TOTAL:</span>
                    <span style={{ fontWeight: 900 }}>
                      {(totalOpt.amount + totalOpt.fee)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          </Table.Summary>
        )}
        sticky
        bordered
      />
      {/* context */}
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
                  status: "completed",
                  type: null,
                  tellerId: null,
                  encoderId: null,
                  sub_type: null,
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
        <Space size={[16, 16]} direction="vertical">
          <div>
            <label>Select a User</label> <br />
            <Select
              size="large"
              style={{ width: 150 }}
              placeholder="Select a Teller"
              value={tellerName}
              options={tellers.map((e) => ({
                label: `[${e.role.toLocaleUpperCase()}] ${e.name}`,
                value: e.name,
                key: `${e._id}_${e.role}`,
              }))}
              onChange={(_, e: any) => {
                // setFilter({ ...filter, tellerId: e?.key ?? null });
                if (e) {
                  let [id, role] = e?.key.split("_");
                  setFilter({
                    ...filter,
                    [role == "teller" ? "tellerId" : "encoderId"]: id ?? null,
                  });
                } else {
                  setFilter({ ...filter, tellerId: null, encoderId: null });
                }

                setTellerName(e?.label.split("]")[1]);
              }}
              allowClear
            />
          </div>
          <div>
            <label>Date</label> <br />
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
          </div>
          <div>
            <label>Transaction Type</label> <br />
            <Select
              size="large"
              style={{ width: 200 }}
              placeholder="Select a Transaction Type"
              value={filter.type}
              options={[
                "bills",
                "wallet",
                "eload",
                "miscellaneous",
                "shopee",
              ].map((e) => ({
                label: e.toLocaleUpperCase(),
                value: e,
              }))}
              onChange={(_, e: any) =>
                setFilter({ ...filter, type: e?.value ?? null })
              }
              allowClear
            />
          </div>
          <div>
            <label>Status</label> <br />
            <Select
              size="large"
              style={{ width: 120 }}
              placeholder="Select a Status"
              value={filter.status}
              options={["completed", "failed", "pending"].map((e) => ({
                label: e.toLocaleUpperCase(),
                value: e,
              }))}
              onChange={(_, e: any) =>
                setFilter({ ...filter, status: e?.value ?? null })
              }
              allowClear
            />
          </div>
          <div>
            <label>Search biller</label> <br />
            <Input
              size="large"
              style={{ width: 200 }}
              placeholder="Search a Biller"
              onChange={(e) =>
                setFilter({ ...filter, sub_type: e.target.value })
              }
              allowClear
            />
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default TransactionHistory;
