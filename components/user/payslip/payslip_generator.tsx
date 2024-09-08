import { PayslipGeneratorProp, PayslipProp, User } from "@/types";
import { Button, Col, Drawer, Row, Space, Typography } from "antd";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import usePayslipGenerator from "./payslip_generator.hook";
import dayjs from "dayjs";

const PaySlipGenerator = (props: PayslipGeneratorProp) => {
  const { open, close, cutOffDate } = props;
  const ref = useRef<HTMLDivElement>(null);

  const { user, totalEarningWithTax, deductions } = usePayslipGenerator(props);
  const { total, totalCashAdvance, error } = deductions;

  return (
    <Drawer
      open={open}
      onClose={close}
      placement="bottom"
      height="100%"
      width="100%"
      title={
        <Typography.Title level={3} style={{ margin: 0 }}>
          Payslip Generator
        </Typography.Title>
      }
      extra={
        <ReactToPrint
          trigger={() => (
            <Button type="primary" size="large" block>
              PRINT
            </Button>
          )}
          content={() => ref.current}
          onBeforeGetContent={() => {}}
          onAfterPrint={() => {}}
          pageStyle={`
          @page {
            size: A4 landscape; 
            margin: 0;
          }
          @media print {
            body {
                margin: 25mm 25mm 25mm 25mm;
                transform: scale(0.6);
                transform-origin: top;
                height: auto;
            }

            page {
                padding-top: 20mm;
            }
          }
      `}
          removeAfterPrint
        />
      }
      zIndex={99999}
    >
      <Row gutter={32}>
        <div className="container" ref={ref}>
          <header className="ps-header">
            <div className="logo">
              <img src="/logo-2.png" alt="Company Logo" />
            </div>
            <div className="company-name">
              <h2>
                MV <br />
                VENTURES
              </h2>
            </div>
          </header>

          <section className="payroll-details">
            <div className="details">
              <p>PAYROLL PERIOD</p>
              <p>{cutOffDate}</p>
            </div>
            <div className="details">
              <p>PAYROLL DATE</p>
              <p>{dayjs().format("DD-MMM-YYYY")}</p>
            </div>
          </section>

          <section className="employee-details">
            <div className="employee-info">
              <p>
                EMPLOYEE NUMBER: <strong>{user?.employeeId}</strong>
              </p>
              <p>
                STATUS: <strong>REGULAR</strong>
              </p>
            </div>
            <div className="employee-info">
              <p>
                EMPLOYEE NAME:
                <strong>{user?.name.toLocaleUpperCase()}</strong>
              </p>
            </div>
          </section>

          <section className="earnings-deductions-summary">
            <div className="table">
              <div className="column">
                <h3>EARNINGS</h3>
                <p>
                  BASIC PAY
                  <span>
                    ₱
                    {(user?.baseSalary ?? 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
                <p>OVERTIME</p>
                <p>ALLOWANCES</p>
                <br />
                <p>
                  <strong>TOTAL TAXABLE</strong>
                  <strong>
                    ₱
                    {(totalEarningWithTax ?? 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </p>
                <br />
                <p>13TH MONTH PAY</p>
                <p>VL CONVERSION</p>
                <p>MEDICAL ALLOWANCE</p>
                <p>RICE ALLOWANCE</p>
                <p>LOAD ALLOWANCE</p>
                <p>LAUNDRY ALLOWANCE</p>
                <p>OTHER NON-TAXABLE</p>
                <br />
                <p>
                  <strong>TOTAL NON-TAXABLE</strong> <strong>₱0.00</strong>
                </p>
              </div>

              <div className="column">
                <h3>DEDUCTIONS</h3>
                {(user?.deductions ?? []).map((e) => (
                  <p>
                    {e.name.toLocaleUpperCase()}
                    <span>
                      ₱
                      {(e.amount / 2).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                ))}
                <p>
                  Cash Advance(s){" "}
                  <span>
                    ₱
                    {totalCashAdvance.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
                <p>
                  ERRORS
                  <span>
                    ₱
                    {error.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
                <br />
                <p>
                  <strong>TOTAL DEDUCTIONS</strong>
                  <strong>
                    ₱
                    {total.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </p>
              </div>

              <div className="column">
                <h3>SUMMARY</h3>
                <p>
                  TOTAL TAXABLE
                  <span>
                    ₱
                    {(user?.baseSalary ?? 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>
                <p>
                  TOTAL NON- TAXABLE <span>0.00</span>
                </p>
                <p>
                  <strong>GROSS PAY</strong>
                  <strong>
                    ₱
                    {(user?.baseSalary ?? 0).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </p>
                <br />
                <p>
                  <strong>TOTAL DEDUCTIONS</strong>
                  <strong>
                    ₱
                    {total.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </p>
                <br />
                <p>
                  <strong>NET PAY</strong>{" "}
                  <strong>
                    ₱
                    {((user?.baseSalary ?? 0) - total).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </strong>
                </p>
                <br />
                <p>
                  <strong>MODE OF TRANSFER:</strong> BANK/CASH/WALLET
                </p>
              </div>
            </div>
          </section>

          <section className="certification">
            <div className="certified">
              <p>CERTIFIED BY:</p>
              <br />
              <br />
              <br />
              <p>
                <strong>MAYAN VELAYO</strong>
                <br />
                FINANCE
              </p>
            </div>
            <div className="received">
              <p>RECEIVED BY:</p>
              <br />
              <br />
              <br />
              <p>
                <strong>{(user?.name ?? "").toLocaleUpperCase()}</strong>
                <br />
                EMPLOYEE
              </p>
            </div>
          </section>
        </div>
      </Row>
    </Drawer>
  );
};

export default PaySlipGenerator;
