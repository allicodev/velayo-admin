import React from "react";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Typography,
} from "antd";
import dayjs from "dayjs";

interface MyProps {
  open: boolean;
  close: () => void;
  update: (_: string, __: any) => void;
  onAdd: () => void;
}

const NewCashAdvance = (props: MyProps) => {
  const { open, close, update, onAdd } = props;

  return (
    <Modal
      title={<Typography.Title level={4}>New Cash Advance</Typography.Title>}
      open={open}
      onCancel={close}
      closable={false}
      width={300}
      footer={null}
    >
      <InputNumber<number>
        controls={false}
        className="customInput"
        size="large"
        prefix="₱"
        placeholder="Amount"
        formatter={(value: any) =>
          value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
        style={{
          width: "100%",
          marginBottom: 8,
        }}
        onChange={(e) => update("amount", e)}
      />
      <Input.TextArea
        placeholder="Remarks"
        onChange={(e) => update("remarks", e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <DatePicker
        format="MMMM DD, YYYY"
        defaultValue={dayjs()}
        size="large"
        onChange={(e) => update("createdAt", e)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Button size="large" type="primary" onClick={onAdd} block>
        SUBMIT
      </Button>
    </Modal>
  );
};

export default NewCashAdvance;
