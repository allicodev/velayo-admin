import React, { useEffect, useState } from "react";
import { Card, Skeleton, Typography } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Title, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BranchSales } from "@/types";

ChartJS.register(ArcElement, Tooltip, Title, Legend, ChartDataLabels);

const SalesPerBranch = ({
  isMobile,
  data,
  loading,
}: {
  isMobile?: boolean;
  data: BranchSales[];
  loading?: boolean;
}) => {
  const [branchData, setBranchData] = useState<BranchSales[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log(data);
      setBranchData(data);
    }
  }, [data]);

  return (
    <Card
      styles={{
        body: {
          height: 350,
          marginTop: 0,
        },
      }}
    >
      <Typography.Title
        level={4}
        style={{
          fontFamily: "sans-serif",
          margin: 0,
          display: "block",
          textAlign: "center",
        }}
      >
        MISC SALES COUNT PER BRANCH
      </Typography.Title>
      {!isMobile && (
        <Typography.Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            letterSpacing: 2.5,
          }}
        >
          FROM SALES INVENTORY PER BRANCH
        </Typography.Text>
      )}
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
        <div
          style={{
            height: 270,
            position: "relative",
          }}
        >
          <Doughnut
            data={{
              labels: branchData
                .filter((e) => e.total != undefined)
                .map((e) => e.name),
              datasets: [
                {
                  label: "Sales",
                  data: branchData.map((e) => e.total),
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                  ],
                  hoverOffset: 25,
                },
              ],
            }}
            plugins={[
              {
                id: "doughnutCenterText",
                afterDatasetsDraw: (chart) => {
                  const { width, height } = chart.chartArea;
                  const ctx = chart.ctx;
                  const can = chart.canvas;

                  can.style.letterSpacing = "1px";
                  ctx.save();
                  ctx.font = "0.7em sans-serif";
                  ctx.fillStyle = "#aaa";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  const text = "TOTAL BRANCH";
                  const textX =
                    Math.round((width - ctx.measureText(text).width) / 2) +
                    ctx.measureText(text).width / 2;

                  const textY = height / 2;
                  ctx.fillText(text, textX, textY - 10);
                  ctx.restore();

                  ctx.save();
                  ctx.font = "2em sans-serif";
                  ctx.fillStyle = "black";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  const _text = "4";
                  const _textX =
                    Math.round((width - ctx.measureText(_text).width) / 2) +
                    ctx.measureText(_text).width / 2;

                  const _textY = height / 2;
                  ctx.fillText(_text, _textX, _textY + 15);
                  ctx.restore();
                },
              },
            ]}
            options={{
              cutout: 65,
              radius: 100,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  onClick: () => null,
                  labels: {
                    usePointStyle: true,
                  },
                },
                datalabels: {
                  color: "#fff",
                  formatter: function (value, context) {
                    if (value == undefined) return "";
                    return `${parseInt(
                      branchData[branchData.map((e) => e.total).indexOf(value)]
                        .percentValue
                    )}%`;
                  },
                },
              },
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default SalesPerBranch;
