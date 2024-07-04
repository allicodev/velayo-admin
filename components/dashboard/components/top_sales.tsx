import React from "react";
import { Card, Skeleton, Typography } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { TopItem } from "@/types";

ChartJS.register(
  Tooltip,
  Title,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const TopSales = ({
  data,
  loading,
}: {
  data: TopItem[];
  loading?: boolean;
}) => {
  const generateCustomTitle = (txt: string) => {
    let _: string[] = [];
    let div = (txt.length / 15).toString();
    if (parseInt(div) > 0) {
      for (let i = 0; i < parseInt(div); i++) {
        _.push(txt.substr(i * 15));
      }
    } else return txt;

    return _;
  };

  return (
    <Card
      styles={{
        body: {
          height: 300,
        },
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
        TOP 3 ITEM BY SALES
      </Typography.Title>
      {loading ? (
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: 270,
          }}
        >
          <Skeleton.Node active>
            <DotChartOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />
          </Skeleton.Node>
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%", paddingBottom: 10 }}>
          <Bar
            data={{
              labels: data.map((e) => generateCustomTitle(e.name)),
              datasets: [
                {
                  label: "Sales",
                  data: data.map((e) => e.quantity),
                  barPercentage: 0.8,
                  backgroundColor: [
                    "rgba(255, 99, 132)",
                    "rgba(255, 159, 64)",
                    "rgba(255, 205, 86)",
                  ],
                },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "#afb1bb",
                    // callback: (value) => value.toString(),
                  },
                },
                x: {
                  ticks: {
                    color: "#afb1bb",
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default TopSales;
