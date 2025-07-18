import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Flex,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  SettingOutlined,
  DeleteOutlined,
  MessageOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import {
  BalanceUpdaterProps,
  Log,
  NewPortalProps,
  Portal as PortalProp,
  RoleType,
} from "@/types";
import PortalService from "@/provider/portal.service";
import NewPortal from "./components/new_portal";
import BalanceUpdater from "./components/balance_updater";
import LogService from "@/provider/log.service";
import dayjs from "dayjs";
import RequestBalance from "./components/request_balance";

interface FilterProps {
  page?: number;
  pageSize?: number;
  name?: string | null;
  assign?: string[] | null;
}

const Portal = () => {
  const [portals, setPortals] = useState<PortalProp[]>([]);
  const [selectedPortal, setSelectedPortal] = useState<PortalProp | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [openNewPortal, setOpenNewPortal] = useState<{
    open: boolean;
    portal?: PortalProp | null;
  }>({
    open: false,
    portal: null,
  });
  const [openBalanceUpdater, setOpenBalanceUpdater] =
    useState<BalanceUpdaterProps>({
      open: false,
      _id: null,
      name: null,
      type: null,
    });
  const [filter, setFilter] = useState<FilterProps>({
    name: null,
    assign: null,
  });
  const [openRequestBalance, setOpenRequestBalance] = useState<{
    open: boolean;
    portal: PortalProp | null;
  }>({
    open: false,
    portal: null,
  });

  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");

  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

  const column: TableProps<PortalProp>["columns"] = [
    {
      title: "Portal Name",
      width: isMobile ? 100 : undefined,
      render: (_, row) => (
        <Badge
          count={
            row.requests?.filter((e) => e.status != "rejected")?.length ?? 0
          }
          offset={[8, 0]}
        >
          <Typography.Text
            style={{
              color: selectedPortal?._id == row._id ? "#fff" : "#000",
            }}
          >
            {row.name}
          </Typography.Text>
        </Badge>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignTo",
      width: isMobile ? 100 : undefined,
      render: (_) => _.map((e: any) => e.toLocaleUpperCase()).join(", "),
    },
    {
      title: "Current balance",
      width: isMobile ? 130 : 200,
      align: "center",
      dataIndex: "currentBalance",
      render: (_) => (
        <span
          style={{ color: _ < 0 ? "red" : undefined }}
        >{`₱${_.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}</span>
      ),
    },
    {
      title: "Functions",
      align: "center",
      width: 180,
      render: (_, row) => (
        <Space>
          <Tooltip title="Add Balance">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() =>
                setOpenBalanceUpdater({
                  open: true,
                  _id: row._id,
                  name: row.name,
                  type: "add",
                })
              }
            />
          </Tooltip>
          <Tooltip title="Deduct Balance">
            <Button
              icon={<MinusOutlined />}
              type="primary"
              onClick={() =>
                setOpenBalanceUpdater({
                  open: true,
                  _id: row._id,
                  name: row.name,
                  type: "subract",
                })
              }
            />
          </Tooltip>
          <Tooltip title="Edit Portal">
            <Button
              icon={<SettingOutlined />}
              type="primary"
              onClick={() => setOpenNewPortal({ open: true, portal: row })}
            />
          </Tooltip>
          <Tooltip title="Delete History">
            <Popconfirm
              title="Are you sure to remove this?"
              okText="remove"
              icon={null}
              okButtonProps={{
                danger: true,
              }}
              onConfirm={() => handleDeletePortal(row._id ?? "")}
            >
              <Button icon={<DeleteOutlined />} type="primary" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const column2: TableProps<Log>["columns"] = [
    {
      title: "From",
      render: (_, row) => (
        <>
          [{getAcronameRole(row.userId?.role)}] {row.userId?.name}
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_) => (
        <Tag color={_ < 0 ? "red-inverse" : "green-inverse"}>
          ₱{" "}
          {_.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      align: "center",
      render: (_) => dayjs(_).format("MMM DD, YYYY hh:mma"),
    },
  ];

  const getHeader = () => (
    <Flex justify="space-between" align="center">
      <Input
        size="large"
        placeholder="Search Portal..."
        style={{
          width: 200,
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedPortal(null);
          setLogs([]);
        }}
        allowClear
      />
      <Button
        size="large"
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setOpenNewPortal({ open: true })}
      >
        {isMobile ? "New" : "New Portal"}
      </Button>
    </Flex>
  );

  const getHeader2 = () =>
    selectedPortal == null ? (
      <></>
    ) : (
      <Flex justify="space-between" align="center">
        <Typography.Title level={3} style={{ margin: 5 }}>
          {selectedPortal.name} Balance History
        </Typography.Title>

        <Badge count={selectedPortal.requests?.length ?? 0}>
          <MessageOutlined
            style={{ fontSize: "1.5em", cursor: "pointer" }}
            onClick={() =>
              setOpenRequestBalance({
                open: true,
                portal: selectedPortal ?? "",
              })
            }
          />
        </Badge>
      </Flex>
    );

  const getAcronameRole = (type: RoleType) => {
    switch (type) {
      case "admin":
        return "ADM";
      case "teller":
        return "TLR";
      case "encoder":
        return "NCDR";
      default:
        return type;
    }
  };

  const handleNewPortal = async (e: NewPortalProps) => {
    let res = await PortalService.newPortal(e);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      fetchPortal();
    }
  };

  const handleDeletePortal = async (_id: string) => {
    let res = await PortalService.deletePortal(_id);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");

      fetchPortal();
    }
  };

  const fetchPortal = async (prop?: FilterProps, width?: number) => {
    let res = await PortalService.getPortal({ ...prop, project: { logs: 0 } });
    setOpenNewPortal({ open: false, portal: null });
    if (res?.success ?? false) {
      setPortals(res?.data ?? []);
      if (res?.data && res?.data?.length > 0) {
        if (width && width > 600)
          setSelectedPortal(
            selectedPortal == null
              ? res?.data[0]
              : res?.data.filter((e) => e._id == selectedPortal?._id)[0]
          );
      }
    }
  };

  const fetchLogs = async (_id: string) => {
    setFetching(true);
    let res = await LogService.getLog({
      type: "portal",
      portalId: _id,
      page: 1,
      pageSize: 9999999,
    });

    if (res?.success ?? false) {
      setLogs(res?.data ?? []);
      setFetching(false);
    } else setFetching(false);
  };

  const rowClassName = (record: PortalProp) => {
    return record._id === selectedPortal?._id ? "selected-row" : "";
  };

  useEffect(() => {
    if (selectedPortal != null) fetchLogs(selectedPortal?._id ?? "");
  }, [selectedPortal]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      fetchPortal(filter, window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [filter]);

  return (
    <>
      {isMobile && selectedPortal != null && logs.length > 0 ? (
        <>
          <Button
            icon={<LeftOutlined />}
            size="large"
            type="text"
            style={{ width: 70, marginBottom: 10 }}
            onClick={() => setSelectedPortal(null)}
          >
            BACK
          </Button>
          <Col span={24}>
            <Table
              title={getHeader2}
              columns={column2}
              dataSource={logs}
              pagination={{
                size: "small",
                pageSize: 8,
              }}
              loading={fetching}
            />
          </Col>
        </>
      ) : (
        <div
          style={{
            padding: 10,
          }}
        >
          <Row gutter={16}>
            <Col span={isMobile ? 24 : 13}>
              <Table
                title={getHeader}
                dataSource={portals.filter((e) =>
                  e.name
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                )}
                columns={column}
                rowKey={(e) => e._id ?? ""}
                style={{
                  cursor: "pointer",
                }}
                scroll={{
                  y: "65vh",
                  x: isMobile ? "100vw" : "100%",
                }}
                onRow={(row) => {
                  return {
                    onClick: () => setSelectedPortal(row),
                  };
                }}
                rowClassName={rowClassName}
                pagination={false}
                bordered
              />
            </Col>
            {logs.length > 0 && selectedPortal != null && (
              <Col span={11}>
                <Table
                  title={getHeader2}
                  columns={column2}
                  dataSource={logs}
                  pagination={{
                    size: "small",
                    pageSize: 8,
                  }}
                  loading={fetching}
                />
              </Col>
            )}
          </Row>
        </div>
      )}

      {/* context */}
      <NewPortal
        {...openNewPortal}
        close={() => setOpenNewPortal({ open: false, portal: null })}
        onAdd={handleNewPortal}
      />
      <BalanceUpdater
        {...openBalanceUpdater}
        close={() =>
          setOpenBalanceUpdater({
            open: false,
            _id: null,
            name: null,
            type: null,
          })
        }
        refresh={() => {
          fetchPortal();
          fetchLogs(selectedPortal?._id ?? "");
        }}
      />
      <RequestBalance
        open={openRequestBalance.open}
        portal={openRequestBalance.portal!}
        close={() => setOpenRequestBalance({ open: false, portal: null })}
        isMobile={isMobile}
      />
    </>
  );
};

export default Portal;
