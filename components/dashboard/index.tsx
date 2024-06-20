import React from "react";
import { Col, Row } from "antd";
import { TbCurrencyPeso } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";

import DashboardCard from "./components/dash_card";
import SalesPerBranch from "./components/sales_per_branch";
import TopSales from "./components/top_sales";
import SalesAndServices from "./components/sales";

// icon, subText, value, color

const Dashboard = () => {
  return (
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
  );
};

export default Dashboard;
