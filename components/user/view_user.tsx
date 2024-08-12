import React, { CSSProperties, useState } from "react";
import { Button, Col, Drawer, Flex, Row } from "antd";

import { UserWithAttendance } from "@/types";
import { UserProfilePlaceholder } from "../utilities";
import DailyTimeRecord from "./dtr_table";

interface MyProp extends UserWithAttendance {
  open: boolean;
  close: () => void;
}

const ViewUser = (prop: MyProp) => {
  const { user, open, close } = prop;
  const [selectedKey, setSelectedKey] = useState("dtr");

  const showContent = (key: string) => {
    switch (key) {
      case "dtr":
        return <DailyTimeRecord />;
      default:
        return <></>;
    }
  };

  return (
    <Drawer
      open={open}
      width={"88vw"}
      closable={false}
      onClose={close}
      styles={{
        wrapper: {
          boxShadow: "none",
          marginTop: "6.5vh",
        },
        body: {
          padding: 0,
        },
        mask: {
          width: "88vw",
          float: "right",
        },
      }}
      destroyOnClose
    >
      <Row>
        <Col
          span={4}
          style={{
            background: "#98c04c",
            minHeight: "93.5vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <UserProfilePlaceholder
            styles={{
              marginTop: 25,
            }}
          />

          <span
            style={{
              marginTop: 10,
              color: "#fff",
              fontSize: "1.5em",
              fontWeight: 700,
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            {user?.name}
          </span>
          <span
            style={{
              fontSize: "1.2em",
              marginTop: 5,
              color: "#fff",
              textAlign: "justify",
            }}
          >
            {user?.role.toLocaleUpperCase()}
          </span>
          <Flex vertical gap={5} style={{ marginTop: 15 }}>
            <Button
              size="large"
              style={{
                width: 250,
                borderRadius: 0,
                background: "#294b0f",
                color: "#fff",
                border: "none",
              }}
            >
              Daily Time Record
            </Button>
          </Flex>
          <Button
            size="large"
            style={{
              color: "#fff",
              marginTop: "auto",
              border: "none",
              borderRadius: 0,
              background: "#7e7e7e",
            }}
            onClick={close}
            block
          >
            Back
          </Button>
        </Col>
        <Col span={20}>{showContent(selectedKey)}</Col>
      </Row>
    </Drawer>
  );
};

export default ViewUser;
