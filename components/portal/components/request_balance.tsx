import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Table, TableProps, Tag, message } from "antd";
import { BalanceRequest, Portal } from "@/types";
import PortalService from "@/provider/portal.service";
import dayjs from "dayjs";
import LogService from "@/provider/log.service";

interface MyBasicProps {
  open: boolean;
  close: () => void;
  portal: Portal;
  isMobile?: boolean;
}

const RequestBalance = ({ open, close, portal, isMobile }: MyBasicProps) => {
  const [requests, setRequests] = useState<BalanceRequest[]>([]);
  const [trigger, setTrigger] = useState(0);

  const columns: TableProps<BalanceRequest>["columns"] = [
    {
      title: "Encoder Name",
      render: (_, row) => row.encoderId.name,
    },
    {
      title: "Amount",
      width: isMobile ? 90 : undefined,
      align: "center",
      render: (_, row) =>
        row.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "Status",
      align: "center",
      width: isMobile ? 25 : undefined,
      render: (_, row) => (
        <Tag
          color={
            row.status == "pending"
              ? "orange-inverse"
              : row.status == "completed"
              ? "green-inverse"
              : "red-inverse"
          }
        >
          {row.status.toLocaleUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date Requested",
      dataIndex: "createdAt",
      align: "center",
      render: (_) => dayjs(_).format("MM/DD/YY hh:mma"),
    },
    {
      title: "Functions",
      align: "center",
      fixed: isMobile ? "right" : undefined,
      width: isMobile ? 120 : undefined,
      render: (_, row) =>
        row.status == "pending" ? (
          <Space direction={isMobile ? "vertical" : "horizontal"}>
            <Button
              type="primary"
              onClick={() => handleCormfirmRequest(row._id)}
            >
              CONFIRM
            </Button>
            <Button
              type="primary"
              onClick={() => handleRejectRequest(row._id)}
              danger
            >
              REJECT
            </Button>
          </Space>
        ) : (
          <Button type="primary" disabled>
            {row.status.toLocaleUpperCase()}
          </Button>
        ),
    },
  ];

  const fetchRequest = async ({
    page,
    pageSize,
  }: {
    page?: number;
    pageSize?: number;
  }) => {
    let res = await PortalService.getBalanceRequest({
      portalId: portal._id ?? "",
      page,
      pageSize,
    });

    if (res?.success ?? false) setRequests(res?.data ?? []);
  };

  const handleCormfirmRequest = async (_id: string) => {
    let res = await PortalService.updateBalanceRequest(_id, {
      status: "completed",
    });

    if (res?.success ?? false) {
      let res2 = await LogService.newLog({
        userId: res?.data?.encoderId.toString() ?? "",
        type: "portal",
        portalId: res?.data?.portalId,
        amount: res?.data?.amount,
      });

      if (res2?.success ?? false) {
        message.success(res?.message ?? "Success");
        setTrigger(trigger + 1);
      }
    }
  };

  const handleRejectRequest = async (_id: string) => {
    let res = await PortalService.updateBalanceRequest(_id, {
      status: "rejected",
    });

    if (res?.success ?? false) {
      // let res2 = await log.newLog({
      //   userId: res?.data?.encoderId.toString() ?? "",
      //   type: "portal",
      //   portalId: res?.data?.portalId,
      //   amount: res?.data?.amount,
      // });

      // if (res2?.success ?? false) {
      message.success(res?.message ?? "Success");
      setTrigger(trigger + 1);
      // }
    }
  };

  useEffect(() => {
    if (open) fetchRequest({});
  }, [open, trigger]);

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      footer={null}
      width={700}
      title={`${portal?.name} Balance Requests`}
    >
      <Table
        columns={columns}
        dataSource={requests}
        scroll={{
          x: isMobile ? "100vw" : undefined,
        }}
        pagination={{
          onChange(page, pageSize) {
            fetchRequest({ page, pageSize });
          },
          size: "small",
        }}
      />
    </Modal>
  );
};

export default RequestBalance;
