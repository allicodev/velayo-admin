import React from "react";
import { Flex, Table } from "antd";
import useAccountReceivable from "./accountReceivables.hooks";
import AccountFilter from "../elements/AccountFilter";

const AccountReceivable = () => {
  const { columns, accounts, totalAmount, setFilter } = useAccountReceivable();

  return (
    <div style={{ padding: 10 }}>
      <Flex justify="space-between" align="center">
        <AccountFilter onChange={(e) => setFilter({ id: e })} />
        <div style={{ fontSize: "1.2em" }}>
          <strong style={{ marginRight: 15 }}>TOTAL:</strong>
          <span style={{ fontFamily: "abel", fontSize: "1.5em" }}>
            ₱
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </Flex>

      <Table
        columns={columns}
        dataSource={accounts}
        style={{
          width: "50vw",
        }}
        bordered
      />
    </div>
  );
};

export default AccountReceivable;
