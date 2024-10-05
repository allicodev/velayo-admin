import React from "react";
import { Select } from "antd";
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";
import { RootState } from "@/provider/redux/store";

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

interface MyProps {
  onChange: (value?: string | null) => void;
}

const AccountFilter = (props: MyProps) => {
  const userCredit = useSelector((state) => state.users.credit);

  return (
    <div style={{ marginTop: 5, marginBottom: 5 }}>
      <Select
        size="large"
        defaultValue={null}
        style={{ width: 300 }}
        options={[
          { label: "All", value: null },
          ...userCredit.map((e) => ({
            label: `${e.name} ${e.lastname}`,
            value: e._id,
          })),
        ]}
        onChange={(e) => props.onChange(e == undefined ? null : e)}
        allowClear
      />
    </div>
  );
};

export default AccountFilter;
