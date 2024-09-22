import React, { useState } from "react";
import { Button, Drawer, Image, Menu } from "antd";
import { CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoPeople, GoCreditCard } from "react-icons/go";
import { FaMoneyBills } from "react-icons/fa6";
import { WalletOutlined, SettingOutlined } from "@ant-design/icons";
import { MdAutoGraph, MdPointOfSale } from "react-icons/md";
import { TbReportAnalytics, TbCreditCardPay } from "react-icons/tb";
import Cookies from "js-cookie";

interface MyProp {
  open: boolean;
  close: () => void;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}

const MobileMenu = ({ open, close, setSelectedKey }: MyProp) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return (
    <Drawer
      open={open}
      onClose={close}
      width="100vw"
      classNames={{ header: "mobile-menu-header" }}
      closeIcon={<CloseOutlined style={{ fontSize: "1.5em" }} />}
      placement="left"
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
        <Menu
          onClick={(e) => {
            setSelectedKey(e.keyPath.join(" / "));
            close();
          }}
          items={[
            {
              label: "Dashboard",
              key: "dashboard",
              icon: <MdAutoGraph style={{ fontSize: "1em" }} />,
            },
            {
              label: "Users",
              key: "users",
              icon: <GoPeople style={{ fontSize: "1em" }} />,
            },
            {
              label: "Branch",
              key: "branch",
              icon: <LuLayoutDashboard style={{ fontSize: "1em" }} />,
            },
            {
              label: "Credits",
              key: "credit",
              icon: <TbCreditCardPay style={{ fontSize: "1em" }} />,
            },
            {
              label: "Reports",
              key: "report",
              icon: <TbReportAnalytics style={{ fontSize: "1em" }} />,
              children: [
                {
                  label: "Transactions",
                  key: "transaction",
                },
                {
                  label: "Attendance",
                  key: "attendance",
                },
                {
                  label: "Disbursement",
                  key: "disbursement",
                },
              ],
            },
            {
              label: "POS",
              key: "pos",
              icon: <MdPointOfSale style={{ fontSize: "1em" }} />,
              children: [
                {
                  label: "Items",
                  key: "item",
                },
                {
                  label: "Items App Settings",
                  key: "settings",
                },
              ],
            },
            {
              label: "App Settings",
              key: "app",
              icon: <SettingOutlined style={{ fontSize: "1em" }} />,
              children: [
                {
                  label: "Bills",
                  key: "bill settings",
                  icon: <FaMoneyBills />,
                },
                {
                  label: "E-Wallets",
                  key: "ewallet settings",
                  icon: <WalletOutlined />,
                },
                {
                  label: "E-Load",
                  key: "eload settings",
                  icon: <SettingOutlined />,
                },
                {
                  label: "Portals",
                  key: "portal area",
                  icon: <GoCreditCard />,
                },
              ],
            },
          ]}
          mode="inline"
          onOpenChange={(e) => setOpenKeys([e[e.length - 1]])}
          openKeys={openKeys}
          defaultSelectedKeys={["dashboard"]}
          style={{
            height: "81vh",
            fontSize: 20,
          }}
        />
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
