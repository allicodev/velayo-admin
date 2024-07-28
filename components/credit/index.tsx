import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  TableProps,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from "antd";
import {
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { CreditStatus, LogData, UserCredit, UserCreditData } from "@/types";
import NewCredit from "./new_credit";
import CreditService from "@/provider/credit.service";
import dayjs from "dayjs";
import LogService from "@/provider/log.service";

const Credit = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserCreditData[]>();
  const [trigger, setTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserCreditData | null>(null);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [creditLog, setCreditLog] = useState<LogData[]>([]);
  const [editUser, setEditUser] = useState<{
    open: boolean;
    user: UserCreditData | null;
  }>({ open: false, user: null });

  // * for amount history
  const [openAmountHistory, setOpenAmountHistory] = useState({
    open: false,
    logId: "",
  });

  const logService = new LogService();

  const refresh = () => setTrigger(trigger + 1);

  const rowClassName = (record: UserCreditData) =>
    record._id === selectedUser?._id ? "selected-row" : "";

  const getStatus = (status: CreditStatus) => {
    switch (status) {
      case "completed":
        return <Tag color="green-inverse">Completed</Tag>;
      case "overdue":
        return <Tag color="red-inverse">Due</Tag>;
      case "pending":
        return <Tag color="orange-inverse">Pending</Tag>;
    }
  };

  const processWithTotal = (u: UserCreditData): UserCreditData => {
    u.availableCredit =
      u.history == null || u.history.length == 0
        ? u.maxCredit
        : u.history.reduce(
            (p, n) =>
              p -
              (n.status == "completed"
                ? 0
                : n.history.reduce(
                    (pp, nn) => pp + parseFloat(nn.amount.toString()),
                    0
                  )),
            u.maxCredit
          );

    return u;
  };

  const columns: TableProps<UserCreditData>["columns"] = [
    {
      title: "Name",
      render: (_, row) => row.name + " " + row.middlename + " " + row.lastname,
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Max Credit",
      dataIndex: "maxCredit",
      align: "center",
      width: 100,
    },
    {
      title: "Functions",
      align: "center",
      render: (_, row) => (
        <Space>
          <Tooltip title="Update">
            <Button
              icon={<SettingOutlined />}
              type="primary"
              onClick={(e) => setEditUser({ open: true, user: row })}
            />
          </Tooltip>
          <Tooltip title="Delete Customer">
            <Popconfirm
              title="Are you sure to remove this?"
              okText="remove"
              icon={null}
              onConfirm={() => handleDelete(row._id)}
              okButtonProps={{
                danger: true,
              }}
            >
              <Button icon={<DeleteOutlined />} type="primary" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns2: TableProps<LogData>["columns"] = [
    {
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      render: (_, row) => (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <div>
            ₱{" "}
            <span
              style={{
                textDecoration:
                  row.status == "completed" ? "line-through" : undefined,
              }}
            >
              {row
                .history!.reduce(
                  (p, n) => p + parseFloat(n.amount.toString()),
                  0
                )
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </span>
          </div>
          <Tooltip title="Show Payment History">
            <Button
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchLogs(row._id);
                setOpenAmountHistory({ open: true, logId: row._id });
              }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_) => getStatus(_),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (_) => dayjs(_).format("MMM DD, YYYY - hh:mma"),
    },
  ];

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

  const getUsers = async () => {
    setLoading(true);
    let res = await CreditService.getUserCredit();

    if (res?.success ?? false) {
      setLoading(false);
      setUsers(res?.data ?? []);

      if (res?.data!.length > 0) {
        setSelectedUser(processWithTotal(res!.data![0]!));
        fetchLogs(res!.data![0]!._id);
      }
    } else setLoading(false);
  };

  const handleDelete = async (id: string) => {
    let res = await CreditService.deleteCreditUser(id);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      refresh();
    } else message.error(res?.message ?? "Error");
  };

  const fetchLogs = async (userCreditId: string) => {
    setLoading(true);
    let res = await logService.getLog({
      page: 1,
      pageSize: 99999,
      type: "credit",
      userCreditId,
    });

    if (res?.success ?? false) {
      setLogs(
        res?.data?.sort((a, b) =>
          dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
        ) ?? []
      );

      setCreditLog(
        res?.data?.sort((a, b) =>
          dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
        ) ?? []
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [trigger]);

  return (
    <>
      <Spin spinning={loading}>
        <Button
          size="large"
          type="primary"
          onClick={() => setEditUser({ open: true, user: null })}
          style={{ marginBottom: 5 }}
        >
          New User Credit
        </Button>
        <Row gutter={14}>
          <Col span={13}>
            <Table
              columns={columns}
              dataSource={users}
              rowClassName={rowClassName}
              rowKey={(e) => e._id}
              style={{
                cursor: "pointer",
              }}
              onRow={(row) => {
                return {
                  onClick: () => setSelectedUser(row),
                };
              }}
              bordered
            />
          </Col>
          {selectedUser != null && (
            <Col span={11}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Credit Payment:{" "}
                  <span style={{ fontWeight: 700 }}>
                    ₱
                    {creditLog
                      .reduce(
                        (p, n) =>
                          n.status == "pending"
                            ? p +
                              n.history!.reduce(
                                (p, n) => p + parseFloat(n.amount.toString()),
                                0
                              )
                            : 0,
                        0
                      )
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </span>
                </Typography.Title>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Available Credit:{" "}
                  <span style={{ fontWeight: 700 }}>
                    ₱
                    {selectedUser.availableCredit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Typography.Title>
              </div>
              <Table
                columns={columns2}
                dataSource={logs}
                scroll={{
                  y: "65vh",
                }}
              />
            </Col>
          )}
        </Row>
      </Spin>

      {/* context */}
      <NewCredit
        open={editUser.open}
        close={() => setEditUser({ open: false, user: null })}
        onAdd={handleNewUser}
        user={editUser.user}
      />
      <Modal
        open={openAmountHistory.open}
        onCancel={() => setOpenAmountHistory({ open: false, logId: "" })}
        closable={false}
        zIndex={2}
        width={650}
        footer={null}
        destroyOnClose
      >
        <Row gutter={8}>
          <Col span={11}>
            <Timeline
              mode="left"
              className="no-scrollbar"
              style={{
                maxHeight: "50vh",
                overflow: "scroll",
                padding: 25,
              }}
              items={
                logs.length > 0 && openAmountHistory.logId != ""
                  ? logs
                      .filter((e) => e._id == openAmountHistory.logId)[0]
                      .history!.map((e) => ({
                        label: dayjs(e.date).format("MMM DD, YYYY hh:mma"),
                        children: (
                          <>
                            <p>{e.description}</p>
                            <p
                              style={{ color: e.amount > 0 ? "green" : "red" }}
                            >
                              {e.amount > 0 ? "+ " : "- "}₱
                              {Math.abs(e.amount).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </>
                        ),
                      }))
                  : []
              }
            />
          </Col>
          <Col span={2}>
            <Divider type="vertical" style={{ height: "100%" }} />
          </Col>
          {logs.length > 0 && openAmountHistory.logId != "" && (
            <Col span={11}>
              <div
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 10,
                  display: "inline-block",
                  padding: "10px 10px",
                  fontSize: "2.5em",
                  width: 200,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <span style={{ color: "#777" }}>
                  ₱
                  {logs
                    .filter((e) => e._id == openAmountHistory.logId)[0]
                    .amount?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    fontSize: "0.5em",
                    background: "#fff",
                    padding: "3px 5px",
                    borderRadius: 10,
                    lineHeight: 1,
                    display: "inline-block",
                    transform: "translateX(-50%)",
                  }}
                >
                  Base Amount
                </span>
              </div>
              <Divider />
              <div
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 10,
                  display: "inline-block",
                  padding: "10px 10px",
                  fontSize: "2.5em",
                  width: 200,
                  textAlign: "center",
                  position: "relative",
                  marginTop: 20,
                }}
              >
                <span style={{ color: "#777" }}>
                  {
                    logs
                      .filter((e) => e._id == openAmountHistory.logId)[0]
                      .history!.filter((e) =>
                        e.description.toLocaleLowerCase().includes("interest")
                      ).length
                  }
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    lineHeight: 1,
                    left: "50%",
                    fontSize: "0.5em",
                    background: "#fff",
                    padding: "3px 5px",
                    borderRadius: 10,
                    width: "80%",
                    transform: "translateX(-50%)",
                  }}
                >
                  No. of Overdue Days
                </span>
              </div>
              <div
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 10,
                  display: "inline-block",
                  padding: "10px 10px",
                  fontSize: "2.5em",
                  width: 200,
                  textAlign: "center",
                  position: "relative",
                  marginTop: 20,
                }}
              >
                <span style={{ color: "#777" }}>
                  ₱
                  {logs
                    .filter((e) => e._id == openAmountHistory.logId)[0]
                    .history!.filter((e) =>
                      e.description.toLocaleLowerCase().includes("interest")
                    )
                    .reduce((p, n) => p + parseFloat(n.amount.toString()), 0)
                    .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    lineHeight: 1,
                    left: "50%",
                    fontSize: "0.5em",
                    background: "#fff",
                    padding: "3px 5px",
                    borderRadius: 10,
                    transform: "translateX(-50%)",
                  }}
                >
                  Interest
                </span>
              </div>
              <div
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 10,
                  display: "inline-block",
                  padding: "10px 10px",
                  fontSize: "2.5em",
                  width: 200,
                  textAlign: "center",
                  position: "relative",
                  marginTop: 20,
                }}
              >
                <span style={{ color: "#777" }}>
                  ₱
                  {Math.abs(
                    logs
                      .filter((e) => e._id == openAmountHistory.logId)[0]
                      .history!.reduce(
                        (p, n) => p + parseFloat(n.amount.toString()),
                        0
                      )
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    lineHeight: 1,
                    left: "50%",
                    fontSize: "0.5em",
                    background: "#fff",
                    padding: "3px 5px",
                    borderRadius: 10,
                    transform: "translateX(-50%)",
                  }}
                >
                  Total
                </span>
              </div>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};

export default Credit;
