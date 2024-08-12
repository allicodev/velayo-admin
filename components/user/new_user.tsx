import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Steps,
  Typography,
  message,
} from "antd";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";

import { NewUserProps, NewUser as NewUserProp, Deduction } from "@/types";
import { FloatLabel } from "@/assets/ts";
import DeductionCard from "./deduction_card";

const NewUser = ({ open, close, onAdd, onSave, user }: NewUserProps) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStop, setCurrentStep] = useState(0);
  const [openDeduction, setOpenDeduction] = useState(false);
  const [deduction, setDeduction] = useState<Deduction>({
    amount: null,
    name: null,
  });

  const [formInput, setFormInput] = useState<NewUserProp>({
    name: "",
    email: "",
    username: "",
    role: "",
    employeeId: "",
    password: "",
    baseSalary: 0,
    deductions: [],
  });

  const validate = () => {
    if (Object.values(formInput).filter((e) => e === "").length > 0) {
      message.warning("There are blank field. Please Provide.");
      return;
    }

    if (formInput.baseSalary <= 0 || formInput.baseSalary == null) {
      message.warning("Base Salary is empty. Please Provide.");
      return;
    }

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!reg.test(formInput.email)) {
      message.warning("Email is invalid. Please provide a correct one.");
      return;
    }

    if (formInput.password == confirmPassword || user) {
      if (user) onSave(formInput);
      else onAdd(formInput);

      setFormInput({
        name: "",
        email: "",
        username: "",
        role: "",
        employeeId: "",
        password: "",
        baseSalary: 0,
        deductions: [],
      });
      setCurrentStep(0);
      close();
    } else
      message.error(
        "Password and Confirm Password didn't match. Please try again."
      );
  };

  const footerSteps = () => {
    if (currentStop < 2)
      return (
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          {currentStop == 1 && (
            <Button
              style={{
                height: 50,
                fontSize: "1.35em",
                flex: 1,
              }}
              onClick={() => setCurrentStep(currentStop - 1)}
              icon={<LeftOutlined />}
              block
            >
              PREV
            </Button>
          )}
          <Button
            type="primary"
            style={{
              height: 50,
              fontSize: "1.35em",
            }}
            onClick={() => {
              if (currentStop == 1) {
                const { name, employeeId, role } = formInput;
                if (name == "" || employeeId == "" || role == "") {
                  message.warning("Some fields are blank. Please provide.");
                  return;
                }
              }

              setCurrentStep(currentStop + 1);
            }}
            block
          >
            NEXT
          </Button>
        </div>
      );
    else {
      return (
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <Button
            style={{
              height: 50,
              fontSize: "1.35em",
              flex: 1,
            }}
            onClick={() => setCurrentStep(currentStop - 1)}
            icon={<LeftOutlined />}
            block
          >
            PREV
          </Button>
          <Button
            type="primary"
            style={{
              height: 50,
              fontSize: "1.35em",
              flex: 3,
            }}
            onClick={validate}
            block
          >
            {user ? "UPDATE" : "CONFIRM"}
          </Button>
        </div>
      );
    }
  };

  const showCurrent0 = () => (
    <>
      <FloatLabel
        value={formInput.name}
        label="Name"
        style={{
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <Input
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
          className="customInput size-50"
          value={formInput.name}
          style={{
            width: "100%",
            height: 50,
            fontSize: "1.5em",
          }}
        />
      </FloatLabel>
      <FloatLabel
        value={formInput.employeeId}
        label="Employee ID"
        style={{
          marginBottom: 20,
        }}
      >
        <Input
          onChange={(e) =>
            setFormInput({ ...formInput, employeeId: e.target.value })
          }
          className="customInput size-50"
          value={formInput.employeeId}
          style={{
            width: "100%",
            height: 50,
            fontSize: "1.5em",
          }}
        />
      </FloatLabel>
      <FloatLabel value={formInput.role} label="Role">
        <Input
          onChange={(e) => setFormInput({ ...formInput, role: e.target.value })}
          className="customInput size-50"
          value={formInput.role}
          style={{
            width: "100%",
            height: 50,
            fontSize: "1.5em",
          }}
        />
      </FloatLabel>
    </>
  );
  const showCurrent1 = () => (
    <>
      <FloatLabel
        value={formInput.email}
        label="Email"
        style={{
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <Input
          onChange={(e) =>
            setFormInput({ ...formInput, email: e.target.value })
          }
          value={formInput.email}
          className="customInput size-50"
          style={{
            width: "100%",
            height: 50,
            fontSize: "1.5em",
          }}
        />
      </FloatLabel>
      <FloatLabel value={formInput.username} label="Username">
        <Input
          value={formInput.username}
          onChange={(e) =>
            setFormInput({ ...formInput, username: e.target.value })
          }
          className="customInput size-50"
          style={{
            width: "100%",
            height: 50,
            fontSize: "1.5em",
          }}
        />
      </FloatLabel>
      <>
        <FloatLabel
          value={formInput.password}
          label={`${user ? "New " : ""}Password`}
        >
          <Input.Password
            value={formInput.password}
            onChange={(e) =>
              setFormInput({ ...formInput, password: e.target.value })
            }
            style={{
              width: "100%",
              height: 50,
              fontSize: "1.5em",
            }}
          />
        </FloatLabel>
        <FloatLabel value={confirmPassword} label="Confirm Password">
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              height: 50,
              fontSize: "1.5em",
            }}
          />
        </FloatLabel>
      </>
    </>
  );
  const showCurrent2 = () => (
    <>
      <Row
        gutter={64}
        style={{
          marginBottom: 20,
        }}
      >
        <Col
          span={8}
          style={{
            borderRight: "1px solid #ccc",
            marginTop: 30,
          }}
        >
          <FloatLabel
            label="Base Salary"
            value={formInput.baseSalary?.toString()}
          >
            <InputNumber<number>
              controls={false}
              className="customInput custom1"
              size="large"
              prefix="₱"
              value={formInput.baseSalary}
              formatter={(value: any) =>
                value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
              style={{
                width: 150,
              }}
              onChange={(e) => {
                if (e != null) setFormInput({ ...formInput, baseSalary: e });
              }}
            />
          </FloatLabel>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{
              marginBottom: 20,
            }}
            onClick={() => setOpenDeduction(true)}
          >
            New Deduction
          </Button>
        </Col>
        <Col
          span={16}
          style={{
            marginTop: 30,
          }}
        >
          <Typography.Title
            level={3}
            style={{
              color: "#7a7a7a",
            }}
          >
            Deductions
          </Typography.Title>
          {formInput.deductions.map((e, i) => (
            <DeductionCard
              key={`deductionss-${i}`}
              deduction={e}
              onRemove={() => {
                const _deductions = formInput.deductions;

                _deductions.splice(i, 1);
                setFormInput({ ...formInput, deductions: _deductions });
              }}
            />
          ))}
        </Col>
      </Row>
    </>
  );

  useEffect(() => {
    if (user && open) setFormInput(user);
  }, [user, open]);

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          setFormInput({
            name: "",
            email: "",
            username: "",
            role: "",
            employeeId: "",
            password: "",
            baseSalary: 0,
            deductions: [],
          });
          setCurrentStep(0);
          close();
        }}
        footer={null}
        width={600}
        title={
          <Typography.Title
            level={3}
            style={{ margin: 0, textAlign: "center" }}
          >
            {user ? "User Update Form" : "New User Registration Form"}
          </Typography.Title>
        }
        destroyOnClose
        closable={false}
        zIndex={10}
      >
        <Steps
          current={currentStop}
          items={[
            {
              title: "Basic Information",
            },
            {
              title: "Credentials",
            },
            {
              title: "Salary and Deductions",
            },
          ]}
        />
        {currentStop == 0 && showCurrent0()}
        {currentStop == 1 && showCurrent1()}
        {currentStop == 2 && showCurrent2()}
        {footerSteps()}
      </Modal>

      {/* context */}
      <Modal
        zIndex={999}
        open={openDeduction}
        onCancel={() => {
          setOpenDeduction(false);
          setDeduction({ amount: null, name: null });
        }}
        title={<Typography.Title level={4}>New Deduction</Typography.Title>}
        closable={false}
        styles={{
          body: {
            display: "flex",
            gap: 10,
            flexDirection: "row",
          },
        }}
        footer={null}
        destroyOnClose
      >
        <FloatLabel
          value={deduction?.name ?? ""}
          label="Name"
          style={{
            width: "100%",
          }}
        >
          <Input
            value={deduction?.name ?? ""}
            onChange={(e) =>
              setDeduction({
                amount: deduction.amount,
                name: e.target.value,
              })
            }
            className="customInput size-50"
            style={{
              width: "100%",
              height: 50,
              fontSize: "1.5em",
            }}
            autoFocus
          />
        </FloatLabel>
        <FloatLabel
          label="Amount"
          value={deduction?.amount?.toString()}
          style={{
            width: "50%",
          }}
        >
          <InputNumber<number>
            controls={false}
            className="customInput custom1"
            size="large"
            prefix="₱"
            value={deduction?.amount}
            formatter={(value: any) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
            style={{
              width: 150,
            }}
            onChange={(e) => {
              if (e != null) setDeduction({ name: deduction.name, amount: e });
            }}
          />
        </FloatLabel>
        <Button
          type="primary"
          size="large"
          style={{
            height: 50,
            width: "20%",
          }}
          onClick={() => {
            if (
              ![undefined, null, 0].includes(deduction?.amount) ||
              ![undefined, null, ""].includes(deduction?.name)
            ) {
              if (
                formInput.deductions.filter(
                  (e) =>
                    e.name?.toLocaleLowerCase() ==
                    deduction.name?.toLocaleLowerCase()
                ).length > 0
              ) {
                message.warning("Already added");
                return;
              }
              setFormInput({
                ...formInput,
                deductions: [
                  ...formInput.deductions,
                  {
                    name: deduction?.name,
                    amount: deduction?.amount,
                  },
                ],
              });
              setDeduction({ name: null, amount: null });
            } else {
              message.warning("Some fields are empty");
              return;
            }
            setOpenDeduction(false);
          }}
        >
          ADD
        </Button>
      </Modal>
    </>
  );
};

export default NewUser;
