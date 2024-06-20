import React, { useState } from "react";
import { Col, Modal, Row, Typography } from "antd";
import { BranchData } from "@/types";

const BranchChoicer = ({
  open,
  branches,
  onSelectedBranch,
  close,
}: {
  open: boolean;
  branches: BranchData[];
  onSelectedBranch: (obj: BranchData) => void;
  close?: () => void;
}) => {
  return (
    <Modal
      footer={null}
      closable={false}
      open={open}
      title={<Typography.Title level={3}>Select a Branch</Typography.Title>}
      onCancel={close ? close : undefined}
      width={700}
      centered
    >
      <Row gutter={[16, 16]}>
        {branches.map((e, i) => (
          <Col key={`branch-btn-${i}`} span={8}>
            <BranchButton branch={e} onClick={onSelectedBranch} />
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

const BranchButton = ({
  branch,
  onClick,
}: {
  branch: BranchData;
  onClick: (obj: BranchData) => void;
}) => {
  const [onHover, setOnHover] = useState(false);
  return (
    <div
      style={{
        width: 200,
        height: 150,
        border: "1px solid #aaa",
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        background: onHover ? "#d9d9d9" : "#fff",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onClick={() => onClick(branch)}
    >
      <Typography.Text
        style={{
          fontSize: "1.7em",
        }}
        underline={onHover}
      >
        {branch.name}
      </Typography.Text>
      <Typography.Text
        style={{
          fontSize: "1.2em",
          textAlign: "center",
          textDecoration: onHover ? "underline" : "",
        }}
        type="secondary"
      >
        {branch.address}
      </Typography.Text>
    </div>
  );
};

export default BranchChoicer;
