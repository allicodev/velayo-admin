import React from "react";
import { Button, Input, InputNumber, Modal, Typography } from "antd";

interface MyProps {
  open: boolean;
  close: () => void;
  update: (_: string, __: any) => void;
  onUpdate: () => void;
}

const NewErrorForm = (props: MyProps) => {
  const { open, close, update, onUpdate } = props;

  return (
    <Modal
      title={<Typography.Title level={4}>New Error</Typography.Title>}
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
      <Button size="large" type="primary" onClick={onUpdate} block>
        SUBMIT
      </Button>
    </Modal>
  );
};

export default NewErrorForm;
