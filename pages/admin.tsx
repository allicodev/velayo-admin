import React, { useEffect, useLayoutEffect, useState } from "react";
import { notification, Layout } from "antd";
import { Content, Header, Sider } from "@/components/layout";

import { LuLayoutDashboard } from "react-icons/lu";
import { GoPeople, GoCreditCard } from "react-icons/go";
import { FaMoneyBills } from "react-icons/fa6";
import { WalletOutlined, SettingOutlined } from "@ant-design/icons";
import { MdAutoGraph, MdPointOfSale } from "react-icons/md";
import { TbReportAnalytics, TbCreditCardPay } from "react-icons/tb";

import User from "@/components/user/user_list";
import TransactionHistory from "@/components/transaction/transaction_history";
import Attendance from "@/components/attendance/attendance";
import ItemsHome from "@/components/inventory/ItemsHome";
import BillingSettings from "@/components/bill";
import EWalletSettings from "@/components/wallet";
import EloadSettings from "@/components/eload_settings";
import Portal from "@/components/portal";
import Branch from "@/components/branch";
import Dashboard from "@/components/dashboard";
import ItemSettings from "@/components/inventory/item_settings";
import { useItemStore } from "@/provider/context";
import dayjs from "dayjs";
import { ItemData } from "@/types";
import ItemService from "@/provider/item.service";
import Credit from "@/components/credit";
import Cookies from "js-cookie";
import Disbursement from "@/components/disbursement/disbursement";

const Admin = () => {
  const { setItems, lastDateUpdated, setLastDateUpdated, items } =
    useItemStore();
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [width, setWidth] = useState(0);
  const [api, contextHolder] = notification.useNotification();

  const item = new ItemService();

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const minutes = 5; // change this to update the items per (x) minutes

    if (
      Math.abs(dayjs(lastDateUpdated).diff(dayjs(), "minutes")) >= minutes ||
      lastDateUpdated == null ||
      items.length == 0
    ) {
      (async (_) => {
        let res = await _.getItems().catch((e) => {
          api.open({
            type: "warning",
            message: "Session Expired",
            description: "You will be now redirected to Login Page",
            pauseOnHover: false,
            duration: 2,
            onClose: () => {
              Cookies.remove("token");
              window.location.reload();
            },
          });
        });
        if (res?.success ?? false) {
          setItems((res?.data as ItemData[]) ?? []);
          setLastDateUpdated(dayjs());
          console.log("Items are refreshed");
        }
      })(item);
    }
  }, []);

  return (
    <>
      {contextHolder}
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.keyPath.reverse().join(" / "))}
          selectedKey={selectedKey.split(" / ")}
          hide={width < 600}
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
        />
        <Layout>
          <Header selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
          <Content selectedKey={selectedKey}>
            {selectedKey == "dashboard" && <Dashboard />}
            {selectedKey == "users" && <User />}
            {selectedKey == "branch" && <Branch />}
            {selectedKey.includes("report") &&
              selectedKey.includes("transaction") && <TransactionHistory />}
            {selectedKey.includes("report") &&
              selectedKey.includes("attendance") && <Attendance />}
            {selectedKey.includes("report") &&
              selectedKey.includes("disbursement") && <Disbursement />}
            {selectedKey == "credit" && <Credit />}
            {selectedKey.includes("pos") && selectedKey.includes("item") && (
              <ItemsHome />
            )}
            {selectedKey.includes("pos") &&
              selectedKey.includes("settings") && <ItemSettings />}
            {selectedKey.includes("app") && selectedKey.includes("bill") && (
              <BillingSettings />
            )}
            {selectedKey.includes("app") && selectedKey.includes("ewallet") && (
              <EWalletSettings />
            )}
            {selectedKey.includes("app") && selectedKey.includes("eload") && (
              <EloadSettings />
            )}
            {selectedKey.includes("app") && selectedKey.includes("portal") && (
              <Portal />
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Admin;
