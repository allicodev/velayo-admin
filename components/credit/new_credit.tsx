import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Typography,
} from "antd";
import { UserCredit } from "@/types";
import { FloatLabel } from "@/assets/ts";

interface MyProp {
  open: boolean;
  close: () => void;
  onAdd: (_: UserCredit) => Promise<boolean>;
  user?: UserCredit | null;
}

const NewCredit = ({ open, close, onAdd, user }: MyProp) => {
  const [loading, setLoading] = useState(false);
  const [showPrefix, setShowPrefix] = useState(false);
  const [input, setInput] = useState<UserCredit>({
    name: "",
    middlename: undefined,
    lastname: "",
    address: "",
    phone: "",
    maxCredit: 0,
    creditTerm: 30,
  });

  const update = (key: string, value: any) =>
    setInput({ ...input, [key]: value });

  const validate = async () => {
    if (input.maxCredit < 1) {
      message.error("Max Credit is invalid. It should be greater than 0");
      return;
    }

    for (let item in input) {
      if (["", undefined, null].includes(item)) {
        message.error("Some fields are blank. Please provide.");
        return;
      }
    }

    setLoading(true);
    await onAdd(input).then((e) => {
      if (e) {
        setInput({
          name: "",
          middlename: undefined,
          lastname: "",
          address: "",
          phone: "",
          maxCredit: 0,
          creditTerm: 30,
        });
        close();
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user != null) {
      setInput(user);
    }
  }, [user]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        setInput({
          name: "",
          middlename: undefined,
          lastname: "",
          address: "",
          phone: "",
          maxCredit: 0,
          creditTerm: 30,
        });
        close();
      }}
      closable={false}
      footer={null}
      title={
        <Typography.Title level={3}>
          {user != null ? "Update Credit User" : "New Credit User"}
        </Typography.Title>
      }
    >
      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <FloatLabel value={input?.name} label="First Name" style={{ flex: 3 }}>
          <Input
            size="large"
            value={input?.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </FloatLabel>
        <FloatLabel
          value={input?.middlename}
          label="Middle Name"
          style={{ flex: 2 }}
        >
          <Input
            size="large"
            value={input?.middlename}
            onChange={(e) => update("middlename", e.target.value)}
          />
        </FloatLabel>
        <FloatLabel
          value={input?.lastname}
          label="Last Name"
          style={{ flex: 3 }}
        >
          <Input
            size="large"
            value={input?.lastname}
            onChange={(e) => update("lastname", e.target.value)}
          />
        </FloatLabel>
      </div>
      <FloatLabel value={input?.address} label="Address">
        <Input
          size="large"
          value={input?.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </FloatLabel>
      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <FloatLabel value={input?.phone} label="Phone Number">
          <Input
            size="large"
            prefix={showPrefix || input?.phone != null ? "+63" : ""}
            onFocus={() => setShowPrefix(true)}
            onBlur={() => setShowPrefix(false)}
            className={`customInput ${
              showPrefix || input?.phone != null ? "with-prefix" : ""
            }`}
            value={input?.phone}
            onChange={(e) => update("phone", e.target.value)}
            maxLength={10}
            style={{
              width: 180,
            }}
          />
        </FloatLabel>
        <FloatLabel value={input?.maxCredit?.toString()} label="Max Credit">
          <InputNumber<number>
            controls={false}
            className="customInput"
            size="large"
            prefix="₱"
            value={input?.maxCredit}
            formatter={(value: any) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            style={{
              width: 120,
            }}
            onChange={(e) => update("maxCredit", e)}
          />
        </FloatLabel>
        <FloatLabel value={input?.creditTerm?.toString()} label="Payment Terms">
          <Select
            className="customSelect"
            size="large"
            value={input?.creditTerm}
            style={{
              width: 120,
            }}
            options={[
              { label: "7 Days", value: 7 },
              { label: "15 Days", value: 15 },
              { label: "30 Days", value: 30 },
            ]}
            onChange={(e) => update("creditTerm", e)}
          />
        </FloatLabel>
      </div>
      <Button
        size="large"
        type="primary"
        style={{ fontSize: "1.5em", height: 50, fontWeight: 700 }}
        onClick={validate}
        loading={loading}
        block
      >
        {user != null ? "Update" : "Register"}
      </Button>
    </Modal>
  );
};

export default NewCredit;
