import React, { useState } from "react";
import { Button, Drawer, Image, Typography } from "antd";
import {
  CloseOutlined,
  CaretRightOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

interface MyProp {
  open: boolean;
  close: () => void;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

const MobileMenu = ({ open, close, setSelectedKey }: MyProp) => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [expandMenu, setExpandMenu] = useState("");

  return (
    <Drawer
      open={open}
      onClose={close}
      width="100vw"
      classNames={{ header: "mobile-menu-header" }}
      closeIcon={<CloseOutlined style={{ fontSize: "1.5em" }} />}
      style={{
        padding: 15,
      }}
      styles={{
        header: {
          padding: 5,
        },
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
      title={
        <div>
          <span style={{ marginRight: 10 }}>VELAYO ADMIN</span>
          <Image src="/logo-2.png" width={35} preview={false} />
        </div>
      }
    >
      <div>
        <Typography.Title
          level={3}
          className={`custom-menu ${
            selectedMenu == "dashboard" ? "highlight-menu" : ""
          }`}
          onClick={() => {
            setSelectedMenu("dashboard");
            setExpandMenu("");
            setSelectedKey("dashboard");
            close();
          }}
        >
          Dashboard
        </Typography.Title>
        <Typography.Title
          level={3}
          className={`custom-menu ${
            selectedMenu == "users" ? "highlight-menu" : ""
          }`}
          onClick={() => {
            setSelectedMenu("users");
            setExpandMenu("");
            setSelectedKey("users");
            close();
          }}
        >
          Users
        </Typography.Title>
        <Typography.Title
          level={3}
          className={`custom-menu ${
            selectedMenu == "branch" ? "highlight-menu" : ""
          }`}
          onClick={() => {
            setSelectedMenu("branch");
            setExpandMenu("");
            setSelectedKey("branch");
            close();
          }}
        >
          Branch
        </Typography.Title>
        <div>
          <div style={{ display: "flex" }}>
            <Typography.Title
              level={3}
              className={`custom-menu ${
                expandMenu == "report" ? "highlight-parent-menu" : ""
              }`}
              onClick={() =>
                setExpandMenu(expandMenu == "report" ? "" : "report")
              }
              style={{
                width: 130,
              }}
            >
              Report
            </Typography.Title>
            <CaretRightOutlined style={{ fontSize: "2em" }} className="icon" />
          </div>
          <div className={`child-menu ${expandMenu == "report" ? "open" : ""}`}>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "transaction" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("transaction");
                setSelectedKey("report / transaction");
                close();
              }}
            >
              Transactions
            </Typography.Title>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "attendance" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("attendance");
                setSelectedKey("report / attendance");
                close();
              }}
            >
              Attendance
            </Typography.Title>
          </div>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Typography.Title
              level={3}
              className={`custom-menu ${
                expandMenu == "pos" ? "highlight-parent-menu" : ""
              }`}
              onClick={() => setExpandMenu(expandMenu == "pos" ? "" : "pos")}
              style={{ width: 130 }}
            >
              POS
            </Typography.Title>
            <CaretRightOutlined style={{ fontSize: "2em" }} className="icon" />
          </div>
          <div className={`child-menu ${expandMenu == "pos" ? "open" : ""}`}>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "items" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("items");
                setSelectedKey("pos / items");
                close();
              }}
            >
              Items
            </Typography.Title>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "app-settings" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("app-settings");
                setSelectedKey("pos / settings");
                close();
              }}
            >
              Items App Settings
            </Typography.Title>
          </div>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Typography.Title
              level={3}
              className={`custom-menu ${
                expandMenu == "app" ? "highlight-parent-menu" : ""
              }`}
              onClick={() => setExpandMenu(expandMenu == "app" ? "" : "app")}
              style={{ width: 130 }}
            >
              App Settings
            </Typography.Title>
            <CaretRightOutlined style={{ fontSize: "2em" }} className="icon" />
          </div>
          <div className={`child-menu ${expandMenu == "app" ? "open" : ""}`}>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "bills" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("bills");
                setSelectedKey("app / bills");
                close();
              }}
            >
              Bills
            </Typography.Title>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "wallets" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("wallets");
                setSelectedKey("app / ewallet");
                close();
              }}
            >
              E-Wallets
            </Typography.Title>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "load" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("load");
                setSelectedKey("app / eload");
                close();
              }}
            >
              E-Load
            </Typography.Title>
            <Typography.Title
              level={4}
              className={`custom-menu child ${
                selectedMenu == "portal" ? "highlight-menu" : ""
              }`}
              onClick={() => {
                setSelectedMenu("portal");
                setSelectedKey("app / portal");
                close();
              }}
            >
              Portals
            </Typography.Title>
          </div>
        </div>
      </div>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        size="large"
        style={{ fontSize: "1.5em" }}
        onClick={() => {
          Cookies.remove("token");
          window.location.reload();
        }}
        danger
      >
        Logout
      </Button>
    </Drawer>
  );
};

export default MobileMenu;
