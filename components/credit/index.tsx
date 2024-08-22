import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Dropdown,
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
  MoreOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { CreditStatus, LogData, UserCredit, UserCreditData } from "@/types";
import NewCredit from "./new_credit";
import CreditService from "@/provider/credit.service";
import dayjs from "dayjs";
import LogService from "@/provider/log.service";
import AmountHistoryViewer from "./amount_history";

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

  // * mobile
  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

  // * for amount history
  const [openAmountHistory, setOpenAmountHistory] = useState({
    open: false,
    logId: "",
  });

  const logService = new LogService();

  const refresh = () => setTrigger(trigger + 1);

  const rowClassName = (record: UserCreditData) =>
    record._id === selectedUser?._id && !isMobile ? "selected-row" : "";

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
      width: isMobile ? 120 : undefined,
      render: (_, row) => row.name + " " + row.middlename + " " + row.lastname,
    },
    {
      title: "Address",
      width: isMobile ? 200 : undefined,
      dataIndex: "address",
    },
    {
      title: "Max Credit",
      dataIndex: "maxCredit",
      align: "center",
      width: isMobile ? 30 : 100,
      render: (_) =>
        `₱` + _.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
    {
      title: "Functions",
      align: "center",
      width: isMobile ? 10 : 100,
      fixed: isMobile ? "right" : undefined,
      render: (_, row) =>
        isMobile ? (
          <Dropdown
            trigger={["click"]}
            placement="bottomLeft"
            menu={{
              items: [
                {
                  label: (
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditUser({ open: true, user: row });
                      }}
                    >
                      <SettingOutlined /> Update
                    </span>
                  ),
                  key: "update",
                },
                {
                  label: (
                    <Typography.Text type="danger">
                      <Popconfirm
                        title="Are you sure to remove this?"
                        okText="remove"
                        icon={null}
                        onConfirm={(e) => {
                          e?.preventDefault();
                          e?.stopPropagation();
                          handleDelete(row._id);
                        }}
                        onCancel={(e) => {
                          e?.preventDefault();
                          e?.stopPropagation();
                        }}
                        okButtonProps={{
                          danger: true,
                        }}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <DeleteOutlined /> Delete
                        </div>
                      </Popconfirm>
                    </Typography.Text>
                  ),
                  key: "delete",
                },
              ],
            }}
          >
            <Button
              type="text"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <MoreOutlined />
            </Button>
          </Dropdown>
        ) : (
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
      width: isMobile ? 0 : 150,
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
          {!isMobile && (
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
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: isMobile ? "center" : "start",
      render: (_, row) =>
        dayjs(row.dueDate).isBefore(dayjs()) && row.status == "pending" ? (
          <Tag color="red-inverse">Overdue</Tag>
        ) : (
          getStatus(_)
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
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
        if (!isMobile) setSelectedUser(processWithTotal(res!.data![0]!));
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
      // sort via date
      let _logs =
        res?.data?.sort((a, b) =>
          dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
        ) ?? [];

      // sort again via status
      _logs = _logs.sort((a, b) => {
        if (a.status === "pending" && b.status === "completed") return -1;
        if (a.status === "completed" && b.status === "pending") return 1;
        return 0;
      });
      setLogs(_logs);

      setCreditLog(
        res?.data?.sort((a, b) =>
          dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
        ) ?? []
      );
    }
    setLoading(false);
  };

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
    getUsers();
  }, [trigger, width]);

  return (
    <div style={{ padding: 10 }}>
      <Spin spinning={loading}>
        {(!isMobile || (isMobile && selectedUser == null)) && (
          <Button
            size="large"
            type="primary"
            onClick={() => setEditUser({ open: true, user: null })}
            style={{ margin: isMobile ? 10 : 0, marginBottom: 5 }}
          >
            New User Credit
          </Button>
        )}

        <Row gutter={14}>
          {(!isMobile || (isMobile && selectedUser == null)) && (
            <Col span={isMobile ? 24 : 13}>
              <Table
                columns={columns}
                dataSource={users}
                rowClassName={rowClassName}
                rowKey={(e) => e._id}
                scroll={{
                  x: isMobile ? "150vw" : undefined,
                }}
                style={{
                  cursor: "pointer",
                  margin: isMobile ? 10 : 0,
                  marginTop: 5,
                }}
                onRow={(row) => {
                  return {
                    onClick: () => {
                      setSelectedUser(processWithTotal(row));
                      fetchLogs(row._id);
                    },
                  };
                }}
                bordered
              />
            </Col>
          )}
          {selectedUser != null && (
            <Col span={isMobile ? 24 : 11}>
              <div>
                {isMobile && (
                  <Button
                    icon={<LeftOutlined />}
                    size="large"
                    type="text"
                    style={{ width: 70, marginBottom: 10 }}
                    onClick={() => setSelectedUser(null)}
                  >
                    BACK
                  </Button>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.Title
                    level={isMobile ? 5 : 4}
                    style={{
                      margin: isMobile ? 10 : 0,
                      marginBottom: 5,
                      textAlign: "start",
                    }}
                  >
                    Credit Payment
                    <br />
                    <span style={{ fontWeight: 700 }}>
                      ₱{" "}
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
                  <Typography.Title
                    level={isMobile ? 5 : 4}
                    style={{ margin: 0, marginRight: 10, textAlign: "end" }}
                  >
                    Available Credit
                    <br />
                    <span style={{ fontWeight: 700 }}>
                      ₱{" "}
                      {selectedUser?.availableCredit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </Typography.Title>
                </div>
              </div>
              <Table
                columns={columns2}
                dataSource={logs}
                rowKey={(e) => e._id}
                scroll={{
                  y: "60vh",
                }}
                style={{
                  margin: isMobile ? 10 : 0,
                  marginTop: 0,
                }}
                onRow={(row) => {
                  return {
                    onClick: isMobile
                      ? () => {
                          fetchLogs(row._id);
                          setOpenAmountHistory({ open: true, logId: row._id });
                        }
                      : undefined,
                  };
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
        isMobile={isMobile}
      />
      <AmountHistoryViewer
        {...openAmountHistory}
        close={() => setOpenAmountHistory({ open: false, logId: "" })}
        logs={logs}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Credit;
