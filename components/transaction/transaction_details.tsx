import React, { useEffect, useState } from "react";
import { Col, Divider, Modal, Row, Timeline, Typography } from "antd";
import dayjs from "dayjs";

import {
  Branch,
  Credit,
  TransactionDetailsProps,
  TransactionHistoryDataType_type,
  User,
  UserCreditData,
} from "@/types";

const TransactionDetails = ({
  open,
  close,
  transaction,
}: TransactionDetailsProps) => {
  const [textData, setTextData] = useState<[string[], any[]]>([[], []]);

  const latestHistory = () => transaction?.history?.at(-1);

  const getStatusColor = (status: TransactionHistoryDataType_type): string => {
    if (status == "completed") return "#29A645";
    else if (status == "failed") return "#FF0000";
    else return "#EFB40D";
  };

  const getStatusBadge = (status: TransactionHistoryDataType_type) => (
    <div
      style={{
        padding: 2,
        paddingLeft: 15,
        paddingRight: 15,
        color: "#fff",
        display: "inline-block",
        borderRadius: 10,
        fontSize: "0.85em",
        backgroundColor: getStatusColor(status),
      }}
    >
      {status[0].toLocaleUpperCase()}
      {status.slice(1)}
    </div>
  );

  const getStatusHistory = () => (
    <Timeline
      mode="left"
      items={transaction?.history?.map((e) => {
        return {
          label: dayjs(e.createdAt).format("MMM DD, YYYY - hh:mma"),
          children: e.description,
          dot: (
            <div
              style={{
                width: 15,
                height: 15,
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: getStatusColor(e.status),
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: "#fff",
                }}
              />
            </div>
          ),
        };
      })}
    />
  );

  useEffect(() => {
    if (open && transaction) {
      if (transaction.transactionDetails) {
        let _ = JSON.parse(transaction.transactionDetails);
        if (transaction.type == "miscellaneous")
          setTextData([
            [
              "Type",
              "Teller",
              "Request Date",
              "Items**",
              ..._.map((e: any) => e.name),
              "Total",
              ...(transaction.isOnlinePayment
                ? [
                    "Online Payment**",
                    "Portal",
                    "Sender Name",
                    "Sender Number/Account Number",
                  ]
                : []),
              ...(transaction.creditId != null ? [] : ["Current Status"]),
            ],
            [
              transaction.type.toLocaleUpperCase(),
              `${(transaction.tellerId as User)?.name ?? "No Teller"} (${
                (transaction.branchId as Branch)?.name ?? "No Branch"
              })` ?? "No Teller",
              dayjs(transaction?.createdAt).format("MMMM DD, YYYY - hh:mma"),
              "",
              ..._.map((e: any) => (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <span style={{ width: 120 }}>{`₱${(
                    e.quantity * e.price
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}</span>
                  <span>{`₱${e.price} x ${e.quantity}${e.unit}`}</span>
                </div>
              )),
              `₱${
                transaction.type == "miscellaneous"
                  ? (transaction.amount ?? 0) + (transaction.fee ?? 0)
                  : transaction.amount
              }`,
              ...(transaction.isOnlinePayment
                ? [
                    "",
                    transaction.portal,
                    transaction.receiverName,
                    transaction.recieverNum,
                  ]
                : []),
              ...(transaction.creditId != null
                ? []
                : [getStatusBadge(latestHistory()!.status)]),
            ],
          ]);
        else
          setTextData([
            [
              "Type",
              "Biller",
              "Teller",
              "Request Date",
              ...(transaction.creditId != null ? [] : ["Current Status"]),
              "Other Details**",
              ...Object.keys(_)
                .filter(
                  (e: any) =>
                    ![
                      "billerId",
                      "transactionType",
                      "tellerId",
                      "traceId",
                    ].includes(e)
                )
                .map((e) =>
                  e
                    .replaceAll("_", " ")
                    .split(" ")
                    .map((_) => _[0].toLocaleUpperCase() + _.slice(1))
                    .join(" ")
                ),
              ...(transaction.isOnlinePayment
                ? [
                    "Online Payment**",
                    "Portal",
                    "Sender Name",
                    "Sender Number/Account Number",
                  ]
                : []),
              ...(transaction.creditId != null
                ? ["Credit Details**", "Name", "Status"]
                : []),
            ],
            [
              transaction.type.toLocaleUpperCase(),
              transaction.sub_type?.toLocaleUpperCase() ?? "N/A",
              `${(transaction.tellerId as User)?.name ?? "No Teller"} (${
                (transaction.branchId as Branch)?.name ?? "No Branch"
              })` ?? "No Teller",
              dayjs(transaction?.createdAt).format("MMMM DD, YYYY - hh:mma"),
              ...(transaction.creditId != null
                ? []
                : [getStatusBadge(latestHistory()!.status)]),
              "",
              ...Object.keys(_)
                .filter(
                  (e: any) =>
                    ![
                      "billerId",
                      "transactionType",
                      "tellerId",
                      "traceId",
                    ].includes(e)
                )
                .map((e: any) => {
                  if (typeof _[e] == "string" && _[e].includes("_money"))
                    return `₱${parseInt(_[e].split("_")[0]).toLocaleString()}`;
                  // if (typeof e == "string" && e.startsWith("09"))
                  //   return `+${63}${e.slice(1)}`;
                  return _[e];
                }),

              ...(transaction.isOnlinePayment
                ? [
                    "",
                    transaction.portal,
                    transaction.receiverName,
                    transaction.recieverNum,
                  ]
                : []),
              ...(transaction.creditId != null
                ? [
                    "",
                    (
                      (transaction.creditId as Credit)
                        .userCreditId as UserCreditData
                    ).name +
                      (
                        (transaction.creditId as Credit)
                          .userCreditId as UserCreditData
                      ).middlename +
                      " " +
                      (
                        (transaction.creditId as Credit)
                          .userCreditId as UserCreditData
                      ).lastname,
                    getStatusBadge(transaction.history.at(-1)?.status as any),
                  ]
                : []),
            ],
          ]);
      }
    }
  }, [open]);
  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      title={
        <Typography.Title level={2} style={{ margin: 0 }}>
          Transaction Details
        </Typography.Title>
      }
      width={950}
      zIndex={99}
    >
      <Row gutter={[4, 0]}>
        <Col span={14}>
          {textData[0].map((_, i) => (
            <div style={{ display: "flex" }} key={i}>
              <div
                style={{
                  width: 350,
                  fontSize: 20,
                  marginTop:
                    _.includes("**") ||
                    ((transaction?.type == "miscellaneous" ?? false) &&
                      _.toLocaleLowerCase() == "current status")
                      ? 10
                      : 0,
                  textDecoration: _.includes("**") ? "underline" : "",
                }}
              >
                {_.includes("**") ? _.split("**")[0] : `${_}:`}
              </div>
              <div
                style={{
                  width: 300,
                  fontSize: 20,
                  marginTop:
                    (transaction?.type == "miscellaneous" ?? false) &&
                    _.toLocaleLowerCase() == "current status"
                      ? 10
                      : 0,
                }}
              >
                {textData[1][i]}
              </div>
            </div>
          ))}
          {latestHistory() &&
          latestHistory()?.status == "failed" &&
          transaction?.history?.length != 0 ? (
            <div style={{ display: "flex" }} key="failed-transact-container">
              <div style={{ width: 250, fontSize: 20 }}>Reason/s:</div>
              <div
                style={{
                  width: 300,
                  minHeight: 120,
                  fontSize: 16,
                  borderRadius: 10,
                  marginTop: 5,
                  padding: 5,
                  paddingLeft: 8,
                  background: "#eee",
                }}
              >
                {latestHistory()?.description}
              </div>
            </div>
          ) : null}

          {transaction?.type == "wallet" &&
            transaction.sub_type?.includes("cash-in") &&
            latestHistory()?.status != "request" && (
              <div style={{ display: "flex", marginTop: 15 }}>
                <div
                  style={{
                    width: 350,
                    fontSize: 20,
                  }}
                >
                  Reference Number:
                </div>
                <div
                  style={{
                    width: 300,
                    fontSize: 20,
                  }}
                >
                  {transaction.reference}
                </div>
              </div>
            )}
        </Col>
        <Col span={1}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>
        <Col span={9}>
          <Typography.Title level={4}>Status History</Typography.Title>
          {getStatusHistory()}
        </Col>
      </Row>
    </Modal>
  );
};

export default TransactionDetails;
