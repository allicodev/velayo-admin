import React from "react";
import { Card, Typography } from "antd";
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

ChartJS.register(
  Tooltip,
  Title,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const TopSales = () => {
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
      <div style={{ width: "100%", height: "100%", paddingBottom: 10 }}>
        <Bar
          data={{
            labels: [["sukton nako ang", " kulang na"], "Item 2", "Item 3"],
            datasets: [
              {
                label: "Sales",
                data: [300, 50, 100],
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
    </Card>
  );
};

export default TopSales;
