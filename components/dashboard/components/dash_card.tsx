import React, { ReactNode } from "react";
import { Typography } from "antd";

type DashCardProps = {
  icon: ReactNode;
  subText: string;
  value: string;
  color: string;
  mobile?: boolean;
};

const DashboardCard = ({
  icon,
  subText,
  value,
  color,
  mobile,
}: DashCardProps) => {
  return (
    <div
      style={{
        background: "#fff",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "32px 25px 32px 25px",
        borderRadius: 10,
        border: "1px solid #f0f0f0",
        ...(mobile ? { flexBasis: "auto", flexGrow: 0, flexShrink: 0 } : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          background: `${color}11`,
        }}
      >
        {icon}
      </div>
      <Typography.Text
        type="secondary"
        style={{
          fontWeight: "bold",
          letterSpacing: 1,
          marginTop: 7,
          marginBottom: 7,
        }}
      >
        {subText}
      </Typography.Text>
      <Typography.Text
        style={{
          fontSize: "1.1em",
        }}
      >
        {value}
      </Typography.Text>
    </div>
  );
};

export default DashboardCard;
