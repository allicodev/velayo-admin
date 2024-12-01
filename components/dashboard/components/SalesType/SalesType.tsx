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
import { Card, Spin, Typography } from "antd";

import jason from "@/assets/json/constant.json";
import { SalesTypePerMonth } from "@/types";
import { SalesTypeProp } from "./salesType.types";
import useSaleType from "./salesTypes.hook";

ChartJS.register(Tooltip, Title, Legend, PointElement, LineElement, Filler);

const SalesPerType = (props: SalesTypeProp) => {
  const { sales, colors, isMobile, loading } = useSaleType(props);

  const generateData = (): any => {
    return sales?.map((e, i) => ({
      label: e._id.toLocaleUpperCase(),
      data: jason.months
        .map((e) => e.substring(0, 3))
        .map((month) => {
          let value = null;
          Object.keys(e.sales).map((key) => {
            let _sale = e.sales[key];

            if (month == key) {
              if (![null, undefined, 0].includes(_sale)) {
                value = _sale;
                return;
              } else {
                return;
              }
            } else return;
          });

          return value;
        }),
      backgroundColor: [`#${colors[i]}aa`],
      borderColor: [`#${colors[i]}`],
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 10,
    }));
  };

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
          SALES PER TYPE
        </Typography.Title>
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
            datasets: generateData(),
          }}
          options={{
            maintainAspectRatio: false,
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

export default SalesPerType;
