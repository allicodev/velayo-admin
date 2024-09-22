import { Button, DatePicker, Flex, Select } from "antd";
import React from "react";
import useDisbursementFilter from "./filter.hooks";
import dayjs from "dayjs";

const Filter = () => {
  const { userList, updateFilter, bulkUpdateFilter, exportExcel } =
    useDisbursementFilter();
  return (
    <Flex justify="space-between">
      <Flex gap={8}>
        <Select
          size="large"
          style={{ width: 250 }}
          placeholder="Select a Teller"
          options={userList}
          onChange={(_, e: any) => updateFilter("teller", e ? e.key : null)}
          filterOption={(
            input: string,
            option?: { label: string; value: string }
          ) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          showSearch
        />
        <DatePicker.RangePicker
          size="large"
          format="MMMM DD, YYYY"
          defaultValue={[dayjs(), dayjs()]}
          style={{
            width: 350,
          }}
          onChange={(e) =>
            bulkUpdateFilter({
              fromDate: e ? e[0]!.toISOString() : null,
              toDate: e && e.length == 2 ? e[1]!.toISOString() : null,
            })
          }
        />
      </Flex>

      <Button type="primary" size="large" onClick={exportExcel}>
        EXPORT
      </Button>
    </Flex>
  );
};

export default Filter;
