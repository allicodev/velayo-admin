import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Card, Select, Space, Typography } from "antd";

import jason from "@/assets/json/constant.json";

ChartJS.register(Tooltip, Title, Legend, PointElement, LineElement, Filler);

const SalesAndServices = () => {
  return (
    <Card
      styles={{
        body: {
          height: 485,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title
          level={4}
          style={{
            fontFamily: "sans-serif",
            margin: 0,
            display: "block",
          }}
        >
          SALES & SERVICES
        </Typography.Title>
        <Space>
          <Select
            size="large"
            defaultValue={null}
            style={{
              minWidth: 130,
            }}
            options={[
              {
                label: "All",
                value: null,
              },
              {
                label: "Bills",
                value: "bills",
              },
              {
                label: "Wallet",
                value: "wallet",
              },
              {
                label: "E-Load",
                value: "eload",
              },
              {
                label: "Miscellaneous",
                value: "miscellaneous",
              },
            ]}
          />
          <Select
            size="large"
            defaultValue={new Date().getFullYear()}
            style={{
              width: 80,
            }}
            options={Array(new Date().getFullYear() - 2000)
              .fill(0)
              .map((_, i) => ({ label: 2000 + i, value: 2000 + i }))}
          />
        </Space>
      </div>
      <Line
        data={{
          labels: jason.months.map((e) => e.substring(0, 3)),
          datasets: [
            {
              label: "Sales",
              data: Array(12)
                .fill(0)
                .map((e) => Math.floor(Math.random() * 300)),
              backgroundColor: ["#72c0c8aa"],
              borderColor: ["#72c0c8"],
              fill: true,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          elements: {
            point: {
              radius: 2,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            datalabels: {
              display: false,
            },
            legend: {
              display: true,
              position: "top",
              onClick: () => null,
              labels: {
                usePointStyle: true,
                padding: 20,
              },
            },
          },
        }}
      />
    </Card>
  );
};

export default SalesAndServices;
