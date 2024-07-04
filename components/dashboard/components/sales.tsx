import React, { useEffect, useState } from "react";
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
import { Card, Select, Skeleton, Space, Spin, Typography } from "antd";

import jason from "@/assets/json/constant.json";
import { SalesPerMonth } from "@/types";

ChartJS.register(Tooltip, Title, Legend, PointElement, LineElement, Filler);

const SalesAndServices = ({
  isMobile,
  data,
  loading,
}: {
  isMobile?: boolean;
  data: SalesPerMonth;
  loading?: boolean;
}) => {
  const [sales, setSales] = useState<SalesPerMonth>();

  const generateData = () => {
    return [
      sales?.Jan ?? 0,
      sales?.Feb ?? 0,
      sales?.Mar ?? 0,
      sales?.Apr ?? 0,
      sales?.May ?? 0,
      sales?.Jun ?? 0,
      sales?.Jul ?? 0,
      sales?.Aug ?? 0,
      sales?.Sep ?? 0,
      sales?.Oct ?? 0,
      sales?.Nov ?? 0,
      sales?.Dec ?? 0,
    ];
  };

  useEffect(() => {
    setSales(data);
  }, [data]);

  return (
    <Card
      styles={{
        body: {
          height: 500,
          paddingBottom: 70,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
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
        {loading ? (
          <Skeleton.Input active />
        ) : (
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
              options={Array(new Date().getFullYear() - 1999)
                .fill(0)
                .map((_, i) => ({
                  label: new Date().getFullYear() - i,
                  value: new Date().getFullYear() - i,
                }))}
            />
          </Space>
        )}
      </div>
      {loading ? (
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: "100%",
          }}
        >
          <Spin />
        </div>
      ) : (
        <Line
          data={{
            labels: jason.months.map((e) => e.substring(0, 3)),
            datasets: [
              {
                label: "Sales",
                data: generateData(),
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
      )}
    </Card>
  );
};

export default SalesAndServices;
