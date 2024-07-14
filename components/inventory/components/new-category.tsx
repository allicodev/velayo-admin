import React, { useState } from "react";
import { Button, Input, Modal } from "antd";

interface InitialProps {
  open: boolean;
  close: () => void;
  onCreate: (name: string) => void;
}

const NewCategory = ({ open, close, onCreate }: InitialProps) => {
  const [name, setName] = useState("");
  return (
    <Modal
      open={open}
      onCancel={() => {
        setName("");
        close();
      }}
      closable={false}
      footer={null}
      width={300}
      destroyOnClose
    >
      <Input size="large" onChange={(e) => setName(e.target.value)} />
      <Button
        type="primary"
        size="large"
        disabled={name == ""}
        onClick={() => {
          onCreate(name);
          setName("");
          close();
        }}
        style={{
          marginTop: 10,
        }}
        block
      >
        ADD
      </Button>
    </Modal>
  );
};

export default NewCategory;
