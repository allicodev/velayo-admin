import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  TableColumnsType,
} from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";

import {
  ThresholdFees as ThresholdFeesProps,
  ThresholdFeesColumn,
} from "./threshold.types";

import useThresholdFees from "./thresholdFees.hooks";

const ThresholdFees = (props: ThresholdFeesProps) => {
  const {
    formRef,
    openModal,
    closeModal,
    modalOption,
    handleNewThreshold,
    handleUpdateThreshold,
    errors,
    feesThreshold,
    setSelectedThreshold,
  } = useThresholdFees(props);

  const columns: TableColumnsType<ThresholdFeesColumn> = [
    {
      title: "Amount",
      render: (_, { minAmount, maxAmount }) => `${minAmount} - ${maxAmount}`,
    },
    {
      title: "Charge",
      dataIndex: "charge",
      render: (_) =>
        `₱${_.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Functions",
      render: (_, data) => (
        <Button
          type="primary"
          onClick={() => {
            openModal("edit");
            setSelectedThreshold(data);
            formRef.setFieldsValue(data);
          }}
        >
          <SettingOutlined />
          EDIT
        </Button>
      ),
    },
  ];
  return (
    <>
      <div style={{ display: "flex", gap: 4 }}>
        <Button
          style={{ marginBottom: 8, height: 40 }}
          onClick={() => openModal("new")}
        >
          <PlusOutlined />
          Add New Fee
        </Button>
        <Input
          size="small"
          placeholder="Search amount"
          style={{
            height: 40,
          }}
        />
      </div>
      <Table columns={columns} dataSource={feesThreshold} />

      {/* modal context */}
      <Modal
        open={modalOption.open}
        onCancel={closeModal}
        closable={false}
        title="New Threshold"
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            gap: 12,
          },
        }}
        okText="Confirm"
        onOk={() => formRef.submit()}
        destroyOnClose
      >
        <Form
          form={formRef}
          labelCol={{
            span: 3,
          }}
          onFinish={
            modalOption.type == "new"
              ? handleNewThreshold
              : handleUpdateThreshold
          }
        >
          <Form.Item
            name="minAmount"
            label="Min: "
            rules={[
              {
                required: true,
                message: "Minimum threshold is empty. Please Provide.",
              },
            ]}
          >
            <InputNumber
              placeholder="Minimum"
              addonBefore="₱"
              formatter={(value: any) =>
                value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              controls={false}
            />
          </Form.Item>
          <Form.Item
            name="maxAmount"
            label="Max: "
            rules={[
              {
                required: true,
                message: "Maximum threshold is empty. Please Provide.",
              },
            ]}
          >
            <InputNumber
              placeholder="Maximum"
              addonBefore="₱"
              formatter={(value: any) =>
                value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              controls={false}
            />
          </Form.Item>
          <Form.Item
            name="charge"
            label="Charge: "
            rules={[
              {
                required: true,
                message: "Charge is empty. Please Provide.",
              },
            ]}
          >
            <InputNumber
              placeholder="Charge"
              addonBefore="₱"
              formatter={(value: any) =>
                value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              controls={false}
            />
          </Form.Item>
          {errors.length > 0 && <Alert message={errors[0]} type="warning" />}
        </Form>
      </Modal>
    </>
  );
};

export default ThresholdFees;
