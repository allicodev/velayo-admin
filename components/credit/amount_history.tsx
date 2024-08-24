import React, { useState } from "react";
import { Col, Divider, Modal, Row, Segmented, Timeline } from "antd";
import dayjs from "dayjs";

import { LogData } from "@/types";

interface MyProp {
  open: boolean;
  close: () => void;
  logs: LogData[];
  logId: string;
  isMobile: boolean;
}

const AmountHistoryViewer = ({
  open,
  close,
  logs,
  logId,
  isMobile,
}: MyProp) => {
  const [selectedType, setSelectedType] = useState("amount");
  const logData = logs.filter((e) => e._id == logId);

  console.log(logId);

  const showDesktop = () => (
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
          items={logData[0]?.history!.map((e) => ({
            label: dayjs(e.date).format("MMM DD, YYYY hh:mma"),
            children: (
              <>
                <p>{e.description}</p>
                <p style={{ color: e.amount > 0 ? "green" : "red" }}>
                  {e.amount > 0 ? "+ " : "- "}₱
                  {Math.abs(e.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </>
            ),
          }))}
        />
      </Col>
      <Col span={2}>
        <Divider type="vertical" style={{ height: "100%" }} />
      </Col>
      {logs.length > 0 && logId != "" && (
        <Col
          span={11}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
                .filter((e) => e._id == logId)[0]
                ?.amount?.toLocaleString(undefined, {
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
          <Divider>
            <span style={{ fontSize: "1.5em" }}>
              ({logData[0].interest}% /day)
            </span>
          </Divider>
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
                logData[0]?.history!.filter((e) =>
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
                .filter((e) => e._id == logId)[0]
                ?.history!.filter((e) =>
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
                logData[0]?.history!.reduce(
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
  );

  const showMobile = () => (
    <>
      <Segmented
        size="large"
        value={selectedType}
        options={[
          {
            label: "Amount",
            value: "amount",
          },
          {
            label: "Amount History",
            value: "amount_history",
          },
        ]}
        onChange={setSelectedType}
        style={{
          padding: 5,
        }}
      />
      {selectedType == "amount" && (
        <Timeline
          mode="left"
          className="no-scrollbar"
          style={{
            maxHeight: "50vh",
            overflow: "scroll",
            padding: 25,
          }}
          items={logData[0]?.history!.map((e) => ({
            label: dayjs(e.date).format("MMM DD, YYYY hh:mma"),
            children: (
              <>
                <p>{e.description}</p>
                <p style={{ color: e.amount > 0 ? "green" : "red" }}>
                  {e.amount > 0 ? "+ " : "- "}₱
                  {Math.abs(e.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </>
            ),
          }))}
        />
      )}
      {selectedType == "amount_history" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
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
                .filter((e) => e._id == logId)[0]
                ?.amount?.toLocaleString(undefined, {
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
          <Divider>
            <span style={{ fontSize: "1.5em" }}>
              ({logData[0].interest}% /day)
            </span>
          </Divider>
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
                logData[0]?.history!.filter((e) =>
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
                .filter((e) => e._id == logId)[0]
                ?.history!.filter((e) =>
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
                logData[0]?.history!.reduce(
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
        </div>
      )}
    </>
  );

  return (
    <Modal
      open={open}
      onCancel={close}
      closable={false}
      zIndex={2}
      width={650}
      footer={null}
      destroyOnClose
    >
      {isMobile ? showMobile() : showDesktop()}
    </Modal>
  );
};

export default AmountHistoryViewer;
