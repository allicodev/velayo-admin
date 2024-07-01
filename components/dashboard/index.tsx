import React, { useEffect, useState } from "react";
import { Col, Row, Segmented, Tabs } from "antd";
import { TbCurrencyPeso } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import DashboardCard from "./components/dash_card";
import SalesPerBranch from "./components/sales_per_branch";
import TopSales from "./components/top_sales";
import SalesAndServices from "./components/sales";
import { PageHeader } from "@ant-design/pro-layout";

const Dashboard = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width < 600 ? (
    <Row gutter={[16, 16]}>
      <div
        style={{
          display: "inline-flex",
          gap: 10,
          overflowX: "scroll",
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
          value="₱123,456.00"
          color="#0000ff"
          mobile={true}
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
          value="₱12,345.00"
          color="#0ab39e"
          mobile={true}
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
          value="12,345"
          color="#f19b44"
          mobile={true}
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
          value="12,345"
          color="#f19b44"
          mobile={true}
        />
      </div>
      <Col span={24}>
        <Tabs
          type="card"
          tabBarStyle={{
            margin: 0,
          }}
          items={[
            {
              label: "Sales Branch",
              key: "tab-0",
              children: <SalesPerBranch isMobile={true} />,
            },
            {
              label: "Top Sales",
              key: "tab-1",
              children: <TopSales />,
            },
          ]}
        />
      </Col>
      <Col span={24}>
        <SalesAndServices isMobile />
      </Col>
    </Row>
  ) : (
    <PageHeader title="Dashboard">
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
                value="₱123,456.00"
                color="#0000ff"
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
                value="₱12,345.00"
                color="#0ab39e"
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
                value="12,345"
                color="#f19b44"
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
                value="12,345"
                color="#f19b44"
              />
            </Col>
            <Col span={24}>
              <SalesAndServices />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <SalesPerBranch />
            </Col>
            <Col span={24}>
              <TopSales />
            </Col>
          </Row>
        </Col>
      </Row>
    </PageHeader>
  );
};

export default Dashboard;
