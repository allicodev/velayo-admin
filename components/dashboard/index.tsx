import React, { useEffect, useState } from "react";
import { Col, Row, Tabs } from "antd";
import { TbCurrencyPeso } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import DashboardCard from "./components/dash_card";
import SalesPerBranch from "./components/sales_per_branch";
import TopSales from "./components/top_sales";
import SalesAndServices, { FilterProp } from "./components/sales";
import EtcService from "@/provider/etc.service";
import { DashboardData } from "@/types";
import SalesPerType from "./components/sales_per_type";

const Dashboard = () => {
  const [width, setWidth] = useState(0);
  const [dashboard, setDashboard] = useState<DashboardData>();
  const [loading, setLoading] = useState(false);
  const [salesMax, setSalesMax] = useState(0);
  const [filter, setFilter] = useState<FilterProp>({
    type: null,
    year: new Date().getFullYear(),
  });

  const etc = new EtcService();

  const getData = async () => {
    setLoading(true);
    let res = await etc.getDashboardData();

    if (res?.success ?? false) {
      setDashboard(res?.data);
      setSalesMax(
        Math.ceil(
          Math.max(...Object.values(res?.data?.salesPerMonth!)) / 1000000
        ) * 1000000
      );
      setLoading(false);
    } else setLoading(false);
  };

  const parseToMoney = (n: number) =>
    `₱${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getSales = async (_filter: FilterProp) => {
    let res = await etc.getDashboardDataSales(_filter);

    if (res?.success ?? false) {
      if (res.data != undefined)
        setDashboard({ ...dashboard!, salesPerMonth: res.data });
    }
  };

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    getData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getSales(filter);
  }, [filter]);

  return width < 600 ? (
    <>
      <div
        style={{
          display: "inline-flex",
          gap: 10,
          overflowX: "scroll",
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <DashboardCard
          icon={
            <TbCurrencyPeso
              color="#0000ff"
              style={{
                fontSize: "1.5em",
              }}
            />
          }
          subText="SALES"
          value={parseToMoney(dashboard?.totalSales ?? 0)}
          color="#0000ff"
          mobile={true}
          loading={loading}
        />
        <DashboardCard
          icon={
            <TbCurrencyPeso
              color="#0ab39e"
              style={{
                fontSize: "1.5em",
              }}
            />
          }
          subText="NET SALES"
          value={parseToMoney(dashboard?.totalNetSales ?? 0)}
          color="#0ab39e"
          mobile={true}
          loading={loading}
        />
        <DashboardCard
          icon={
            <GrTransaction
              color="#f19b44"
              style={{
                fontSize: "1.5em",
              }}
            />
          }
          subText="TRANSACTIONS"
          value={(dashboard?.totalTransaction ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          color="#f19b44"
          mobile={true}
          loading={loading}
        />
        <DashboardCard
          icon={
            <GrTransaction
              color="#a96c30"
              style={{
                fontSize: "1.5em",
              }}
            />
          }
          subText="TRANSACTIONS TODAY"
          value={(dashboard?.totalTransactionToday ?? 0).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          )}
          color="#f19b44"
          mobile={true}
          loading={loading}
        />
      </div>
      <Col
        span={24}
        style={{
          padding: 5,
        }}
      >
        <Tabs
          type="card"
          tabBarStyle={{
            margin: 0,
          }}
          items={[
            {
              label: "Sales Branch",
              key: "tab-0",
              children: (
                <SalesPerBranch
                  isMobile={true}
                  data={dashboard?.branchSales ?? []}
                  loading={loading}
                />
              ),
            },
            {
              label: "Top Sales",
              key: "tab-1",
              children: (
                <TopSales
                  data={dashboard?.topItemSales ?? []}
                  loading={loading}
                />
              ),
            },
          ]}
        />
      </Col>
      <Col span={24} style={{ padding: 5 }}>
        <SalesAndServices
          data={dashboard?.salesPerMonth!}
          loading={loading}
          filter={filter}
          setFilter={setFilter}
          type={filter.type}
          max={salesMax}
          isMobile
        />
      </Col>
    </>
  ) : (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ display: "flex", gap: 16 }}>
            <DashboardCard
              icon={
                <TbCurrencyPeso
                  color="#0000ff"
                  style={{
                    fontSize: "1.5em",
                  }}
                />
              }
              subText="SALES"
              value={parseToMoney(dashboard?.totalSales ?? 0)}
              color="#0000ff"
              loading={loading}
            />
            <DashboardCard
              icon={
                <TbCurrencyPeso
                  color="#0ab39e"
                  style={{
                    fontSize: "1.5em",
                  }}
                />
              }
              subText="NET SALES"
              value={parseToMoney(dashboard?.totalNetSales ?? 0)}
              color="#0ab39e"
              loading={loading}
            />
            <DashboardCard
              icon={
                <GrTransaction
                  color="#f19b44"
                  style={{
                    fontSize: "1.5em",
                  }}
                />
              }
              subText="TRANSACTIONS"
              value={(dashboard?.totalTransaction ?? 0).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )}
              color="#f19b44"
              loading={loading}
            />
            <DashboardCard
              icon={
                <GrTransaction
                  color="#a96c30"
                  style={{
                    fontSize: "1.5em",
                  }}
                />
              }
              subText="TRANSACTIONS TODAY"
              value={(dashboard?.totalTransactionToday ?? 0).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )}
              color="#f19b44"
              loading={loading}
            />
          </Col>
          <Col span={24}>
            <SalesPerType
              data={dashboard?.salesPerType ?? []}
              loading={loading}
              max={salesMax}
            />
            {/* <SalesAndServices
              data={dashboard?.salesPerMonth!}
              loading={loading}
              filter={filter}
              setFilter={setFilter}
              type={filter.type}
              max={salesMax}
            /> */}
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <SalesPerBranch
              data={dashboard?.branchSales ?? []}
              loading={loading}
            />
          </Col>
          <Col span={24}>
            <TopSales data={dashboard?.topItemSales ?? []} loading={loading} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
