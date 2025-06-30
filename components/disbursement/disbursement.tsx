import React from "react";
import { Table, Typography } from "antd";
import dayjs from "dayjs";

import DisburmentFilter from "./components/filter";
import useDisbursement from "./disbursement.hook";

const Disbursement = () => {
  const { columns, data } = useDisbursement();

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      <div
        style={{
          padding: 15,
          background: "#fff",
          borderRadius: 5,
        }}
      >
        <Typography.Title level={3}>
          Disbursement Report{" "}
          <Typography.Text>
            ({dayjs().format("MMMM DD, YYYY - hh:mma")})
          </Typography.Text>
        </Typography.Title>
        <DisburmentFilter />
        <Table
          columns={columns as any}
          dataSource={data}
          style={{ marginTop: 10 }}
        />
      </div>
    </div>
  );
};

export default Disbursement;
