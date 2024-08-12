import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Deduction } from "@/types";

interface MyProp {
  deduction: Deduction;
  onRemove: () => void;
}

const DeductionCard = ({ deduction, onRemove }: MyProp) => {
  const { amount, name } = deduction;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        type="text"
        style={{ marginRight: 10 }}
        icon={<DeleteOutlined style={{ fontSize: "1.5em" }} />}
        onClick={onRemove}
        danger
      />

      <span
        style={{
          fontSize: "1.5em",
        }}
      >
        <strong>{name} </strong> -{" "}
        {amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
};

export default DeductionCard;
