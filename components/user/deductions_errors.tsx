import React, { useState } from "react";
import { Button, Dropdown, Space, Table, Typography } from "antd";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import { LuFileCog2 } from "react-icons/lu";
import dayjs from "dayjs";

import useDeductionsErrors from "./deduction.hook";
import NewErrorForm from "./new_error";
import jason from "@/assets/json/constant.json";
import { User } from "@/types";
import PaySlipGenerator from "./payslip/payslip_generator";
import NewCashAdvance from "./new_ca";

const DeductionsErrors = (prop: { user: User }) => {
  const { user } = prop;
  const [openNewError, setOpenNewError] = useState(false);
  const [openNewCA, setOpenNewCA] = useState(false);
  const [openGeneratePayslip, setOpenGeneratePayslip] = useState(false);

  const {
    tableProps,
    deductions,
    newError,
    newCa,
    loading,
    logs,
    ca,
    cutOff,
    setCutOff,
    updateInput,
    updateInput2,
    month,
    setMonth,
    cutOffDate,
  } = useDeductionsErrors({
    ...prop,
    close: () => {
      setOpenNewError(false);
      setOpenNewCA(false);
    },
  });

  const getTitle = () => {
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
          Errors
        </Typography.Title>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <Button
              onClick={() => setOpenNewCA(true)}
              icon={<PlusOutlined />}
              type="primary"
              size="large"
              style={{
                background: "#294b0f",
              }}
            >
              New Cash Advance
            </Button>
            <Button
              onClick={() => setOpenNewError(true)}
              icon={<PlusOutlined />}
              type="primary"
              size="large"
              style={{
                background: "#294b0f",
              }}
            >
              New Error
            </Button>
            <Button
              type="primary"
              size="large"
              style={{
                background: "#294b0f",
              }}
              icon={<LuFileCog2 />}
              onClick={() => setOpenGeneratePayslip(true)}
            >
              Generate Payslip Invoice
            </Button>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Button
                size="large"
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
                size="large"
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
                  size="large"
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
                    {cutOffDate}
                  </span>
                  <CaretDownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>

        {getTitle()}
        <Table
          columns={tableProps.column2}
          dataSource={logs.map((e) => ({
            remark: e?.remarks ?? "",
            amount: e.amount ?? 0,
            createdAt: e.createdAt!,
          }))}
          bordered
        />

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              width: "50%",
            }}
          >
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
                Cash Advances
              </Typography.Title>
            </div>
            <Table
              columns={tableProps.column3}
              dataSource={ca.map((e) => ({
                remark: e?.remarks ?? "",
                amount: e.amount ?? 0,
                createdAt: e.createdAt!,
              }))}
              pagination={false}
              bordered
            />
          </div>
          <div
            style={{
              width: "50%",
            }}
          >
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
                Auto Deductions
              </Typography.Title>
            </div>
            <Table
              columns={tableProps.column1}
              dataSource={deductions}
              pagination={false}
              bordered
            />
          </div>
        </div>
      </div>

      {/* context */}
      <NewErrorForm
        open={openNewError}
        close={() => setOpenNewError(false)}
        update={updateInput}
        onUpdate={newError}
      />
      <NewCashAdvance
        open={openNewCA}
        close={() => setOpenNewCA(false)}
        update={updateInput2}
        onAdd={newCa}
      />
      <PaySlipGenerator
        open={openGeneratePayslip}
        close={() => setOpenGeneratePayslip(false)}
        userId={user?._id ?? ""}
        cutOffDate={cutOffDate}
        errors={logs.map((e) => ({
          amount: e.amount ?? 0,
        }))}
        cashAdvance={ca.map((e) => ({
          amount: e.amount ?? 0,
        }))}
      />
    </>
  );
};

export default DeductionsErrors;
