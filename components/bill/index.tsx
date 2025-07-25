import React, { ReactNode, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  FloatButton,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Tabs,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

import {
  BillingSettingsType,
  BillingsFormField,
  OptionTypeWithFlag,
} from "@/types";

import { NewBiller, NewOption, UpdateBiller } from "../modals";
import BillService from "@/provider/bill.service";
import { FloatLabel } from "@/assets/ts";
import PrinterException from "../printer_exception";

type State = {
  fee: number | null;
  threshold: number | null;
  additionalFee: number | null;
};

const BillingSettings = () => {
  const [billers, setBillers] = useState<BillingSettingsType[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [feeOpt, setFeeOpt] = useState<State>({
    fee: null,
    threshold: null,
    additionalFee: null,
  });
  const [selectedTab, setSelectedTab] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const [selectedBiller, setSelectedBiller] =
    useState<BillingSettingsType | null>();
  const [openNewBiller, setOpenNewBiller] = useState(false);
  const [openUpdatedBiller, setOpenUpdatedBiller] = useState(false);
  const [billsOptions, setBillsOptions] = useState<OptionTypeWithFlag>({
    open: false,
    options: null,
    index: -1,
    id: null,
  });

  // * mobile
  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

  const getItemStyle = (
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
    isDragging: boolean
  ) => ({
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    background: isDragging ? "#aaa" : "transparent",
    ...draggableStyle,
  });

  const reorder = (
    list: BillingsFormField[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const hasNoMainAmount = () =>
    selectedBiller?.formField
      ?.filter((e) => e.type == "number")
      .map((e) => e.inputNumberOption?.mainAmount)
      .filter((e) => e == true).length == 0;

  const getSideB = (billingFormField: BillingSettingsType) => {
    const billingButton = (formField: BillingsFormField): ReactNode => {
      let index = billingFormField.formField?.indexOf(formField) ?? -1;

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip
            title={
              formField &&
              formField.type == "number" &&
              formField.inputNumberOption?.mainAmount
                ? "This is the field where the main amount is calculated along with fee"
                : ""
            }
          >
            <div
              onClick={() => {
                setBillsOptions({
                  open: true,
                  options: billingFormField.formField![index ?? -1],
                  index,
                  id: selectedBiller?._id ?? null,
                });
                setSelectedIndex(index ?? -1);
              }}
              style={{
                display: "flex",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: 10, fontSize: 25 }}>
                {index! + 1}.
              </span>
              <div
                className="billing-button"
                style={{
                  background: "#fff",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  border: "0.5px solid #D9D9D9",
                  borderRadius: 3,
                  display: "flex",
                  ...(formField &&
                  formField.type == "number" &&
                  formField.inputNumberOption?.mainAmount
                    ? {
                        border: "1px solid #294B0F",
                      }
                    : {}),
                }}
              >
                <span style={{ fontSize: 18, marginRight: 5 }}>
                  {formField.name}
                </span>
                <div
                  style={{
                    background: "#F0F5FF",
                    color: "#2F54EB",
                    padding: 3,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {formField?.type?.toLocaleUpperCase()}
                </div>
              </div>
            </div>
          </Tooltip>
          {formField &&
            formField.type == "number" &&
            formField.inputNumberOption?.mainAmount && (
              <span style={{ marginLeft: 10 }}>- MAIN</span>
            )}
        </div>
      );
    };

    return (
      <div style={{ width: isMobile ? "100%" : "70%" }}>
        <Typography.Title style={{ textAlign: "center" }} ellipsis={isMobile}>
          {billingFormField.name.toLocaleUpperCase()} bills settings{" "}
        </Typography.Title>
        {hasNoMainAmount() && (
          <Alert
            type="error"
            message="There are no main amount selected"
            style={{
              marginBottom: 5,
              width: 220,
            }}
          />
        )}

        <Card
          styles={{
            body: {
              padding: 0,
              background: "#fefefe",
              borderRadius: 10,
            },
          }}
        >
          <Tabs
            type="card"
            onChange={setSelectedTab}
            items={[
              {
                label: "Form Settings",
                key: "form-settings-tab",
                children: billingFormField?.formField?.length != 0 && (
                  <Space
                    direction="vertical"
                    style={{
                      display: "block",
                    }}
                  >
                    <DragDropContext
                      onDragEnd={(result) => {
                        if (!result.destination) {
                          return;
                        }

                        if (billingFormField.formField) {
                          const items = reorder(
                            billingFormField.formField,
                            result.source.index,
                            result.destination.index
                          );

                          let _: BillingSettingsType = {
                            _id: selectedBiller?._id ?? "",
                            name: selectedBiller?.name ?? "",
                            fee: selectedBiller?.fee ?? 0,
                            threshold: selectedBiller?.threshold ?? 0,
                            additionalFee: selectedBiller?.additionalFee ?? 0,
                            formField: items,
                          };

                          // call api and update the current option position
                          (async (b) => {
                            if (selectedBiller?._id != undefined) {
                              let res = await b.updateBillOption(
                                selectedBiller._id,
                                _
                              );

                              if (res.success)
                                message.success(res?.message ?? "Success");
                            }
                          })(BillService);

                          setSelectedBiller(_);
                        }
                      }}
                    >
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {billingFormField.formField?.map((item, index) => (
                              <Draggable
                                key={`${item.type}-${index}`}
                                draggableId={`${item.type}-${index}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    style={getItemStyle(
                                      provided.draggableProps.style,
                                      snapshot.isDragging
                                    )}
                                  >
                                    <div>{billingButton(item)}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Space>
                ),
              },
              {
                label: "Fee Settings",
                key: "fee-settings-tab",
                children: (
                  <Space
                    direction="vertical"
                    size={1}
                    style={{ marginLeft: 10 }}
                  >
                    <FloatLabel label="Fee" value={feeOpt.fee?.toString()}>
                      <InputNumber<number>
                        controls={false}
                        className="customInput"
                        size="large"
                        prefix="₱"
                        value={feeOpt.fee}
                        formatter={(value: any) =>
                          value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value: any) =>
                          value.replace(/\$\s?|(,*)/g, "")
                        }
                        style={{
                          width: 150,
                        }}
                        onChange={(e) => setFeeOpt({ ...feeOpt, fee: e })}
                      />
                    </FloatLabel>

                    <FloatLabel
                      label="Threshold"
                      value={feeOpt.threshold?.toString()}
                    >
                      <InputNumber<number>
                        controls={false}
                        className="customInput"
                        size="large"
                        prefix="₱"
                        value={feeOpt.threshold}
                        formatter={(value: any) =>
                          value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value: any) =>
                          value.replace(/\$\s?|(,*)/g, "")
                        }
                        style={{
                          width: 150,
                        }}
                        onChange={(e) => setFeeOpt({ ...feeOpt, threshold: e })}
                      />
                    </FloatLabel>
                    <FloatLabel
                      label="Addional Fee per Threshold"
                      value={feeOpt.additionalFee?.toString()}
                    >
                      <InputNumber<number>
                        controls={false}
                        className="customInput"
                        size="large"
                        prefix="₱"
                        value={feeOpt.additionalFee}
                        formatter={(value: any) =>
                          value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value: any) =>
                          value.replace(/\$\s?|(,*)/g, "")
                        }
                        style={{
                          width: 250,
                        }}
                        onChange={(e) =>
                          setFeeOpt({ ...feeOpt, additionalFee: e })
                        }
                      />
                    </FloatLabel>
                  </Space>
                ),
              },
              {
                label: "Print Exception Settings",
                key: "printer-exception-settings",
                children: (
                  <PrinterException
                    biller={selectedBiller ?? null}
                    refresh={() => setTrigger(trigger + 1)}
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    );
  };

  const getBillers = () => {
    (async (_) => {
      let res = await _.getBill();
      if (res.success) setBillers(res.data ?? []);
      if (selectedBiller != null) {
        if (res.data)
          setSelectedBiller(res.data[billers.indexOf(selectedBiller)]);
      }
    })(BillService);
  };

  const handleNewBiller = (name: string) => {
    (async (_) => {
      let res = await _.newBill(name);

      if (res.success) {
        message.success(res.message ?? "Successfully Added");
        setOpenNewBiller(false);
        if (res.data) setBillers([...billers, res.data]);
      }
    })(BillService);
  };

  const handleNewOption = (opt: BillingsFormField) => {
    if (billsOptions.options != null) {
      (async (_) => {
        if (selectedBiller?._id != undefined) {
          let res = await _.updateFormFields(
            selectedBiller?._id,
            opt,
            selectedIndex
          );

          if (res.success) {
            setBillsOptions({
              open: false,
              options: null,
              index: -1,
              id: null,
            });
            setTrigger(trigger + 1);
            message.success(res?.message ?? "Success");
          }
        }
      })(BillService);
    } else {
      (async (_) => {
        if (selectedBiller?._id != undefined) {
          let res = await _.pushToFormFields(selectedBiller?._id, opt);

          if (res.success) {
            setBillsOptions({
              open: false,
              options: null,
              index: -1,
              id: null,
            });
            setTrigger(trigger + 1);
            message.success(res?.message ?? "Success");
          }
        }
      })(BillService);
    }
  };

  const handleSaveFee = () => {
    let _fee = {
      id: selectedBiller?._id ?? "",
      fee: feeOpt?.fee ?? 0,
      threshold: feeOpt?.threshold ?? 0,
      additionalFee: feeOpt?.additionalFee ?? 0,
    };

    (async (_) => {
      let res = await _.updateFee(_fee);

      if (res?.success) {
        setSelectedBiller(res.data);
        message.success(res?.message ?? "Success");
        setTrigger(trigger + 1);
      }
    })(BillService);
  };

  const handleMarkAsMain = (id: string, index: number) => {
    return (async (_) => {
      if (id) {
        let res = await _.markMainAmount(id, index);

        if (res.success) {
          message.success(res?.message ?? "Success");
          return true;
        }
      }
    })(BillService);
  };

  const handleDeleteOption = (id: string, index: number) => {
    return (async (_) => {
      if (id) {
        let res = await _.removeOptionIndexed(id, index);

        if (res.success) {
          message.success(res?.message ?? "Success");
          return true;
        }
      }
    })(BillService);
  };

  const handleDeleteBiller = () => {
    (async (_) => {
      let res = await _.deleteBiller(selectedBiller?._id ?? "");
      if (res?.success ?? false) {
        setTrigger(trigger + 1);
        setSelectedBiller(null);
        message.success(res?.message ?? "Success");
      }
    })(BillService);
  };

  useEffect(() => {
    getBillers();
  }, [trigger]);

  useEffect(() => {
    if (selectedBiller)
      setFeeOpt({
        fee: selectedBiller.fee,
        threshold: selectedBiller.threshold,
        additionalFee: selectedBiller.additionalFee,
      });
  }, [selectedBiller]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && selectedBiller != null ? (
        <>
          <Button
            icon={<LeftOutlined />}
            size="large"
            type="text"
            style={{ width: 70, marginBottom: 10 }}
            onClick={() => setSelectedBiller(null)}
          >
            BACK
          </Button>
          {getSideB(selectedBiller)}
          <FloatButton.Group
            trigger="click"
            type="primary"
            shape="square"
            icon={<SettingOutlined />}
          >
            <Popconfirm
              title="Are you sure you want to delete this biller ?"
              okType="primary"
              okText="DELETE"
              okButtonProps={{ danger: true }}
              onConfirm={handleDeleteBiller}
            >
              <FloatButton
                icon={<DeleteOutlined style={{ color: "#f00" }} />}
              />
            </Popconfirm>
            {selectedTab == "form-settings-tab" && (
              <>
                <FloatButton
                  icon={<PlusOutlined />}
                  onClick={() =>
                    setBillsOptions({
                      open: true,
                      options: null,
                      index: -1,
                      id: null,
                    })
                  }
                />
                <FloatButton
                  icon={<SettingOutlined />}
                  type="primary"
                  onClick={() => setOpenUpdatedBiller(true)}
                />
              </>
            )}
            {selectedTab == "fee-settings-tab" && (
              <>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  onClick={handleSaveFee}
                  size="large"
                >
                  Update Fee
                </Button>
              </>
            )}
          </FloatButton.Group>
        </>
      ) : (
        <div style={{ padding: 10 }}>
          <Row
            style={{
              padding: isMobile ? "10px 5px" : 0,
            }}
          >
            <Col span={isMobile ? 24 : 8}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 25,
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <Input
                    size="large"
                    placeholder="Search/Filter Biller"
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                      setSelectedBiller(null);
                    }}
                    value={searchKey}
                    style={{
                      width: "98%",
                      height: 50,
                      fontSize: 25,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <Tooltip title="Reset">
                    <Button
                      icon={<ReloadOutlined />}
                      size="large"
                      onClick={() => {
                        setSearchKey("");
                        setSelectedBiller(null);
                      }}
                      style={{
                        height: 50,
                        width: 50,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    />
                  </Tooltip>
                </div>
                <Button
                  size="large"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setOpenNewBiller(true)}
                  key="add-btn"
                  style={{
                    height: 50,
                  }}
                >
                  New Biller
                </Button>
              </div>
              <Space
                direction="vertical"
                style={{
                  height: isMobile ? "85vh" : "77vh",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  paddingBottom: isMobile ? 0 : 30,
                  width: "100%",
                }}
                className="no-scrollbar"
              >
                {billers
                  .filter((e) => {
                    if (searchKey == "") return true;
                    else
                      return e.name
                        .toLocaleLowerCase()
                        .includes(searchKey.toLocaleLowerCase());
                  })
                  .map((e, i) => (
                    <Tooltip
                      title={
                        e.isDisabled
                          ? "This Biller is under maintenance"
                          : e.name.length > 20
                          ? e.name
                          : ""
                      }
                    >
                      <Button
                        key={`billing-btn-${i}`}
                        disabled={e.isDisabled}
                        style={{
                          paddingTop: 8,
                          paddingBottom: 8,
                          height: 60,
                          background: e.isDisabled
                            ? "#eee"
                            : selectedBiller?._id == e._id
                            ? "#294B0F"
                            : "#fff",
                        }}
                        onClick={() => {
                          setSelectedBiller(e);
                          setSelectedTab("form-settings-tab");
                        }}
                        block
                      >
                        <Typography.Text
                          style={{
                            fontSize: 30,
                            color: e.isDisabled
                              ? "#aaa"
                              : selectedBiller?._id == e._id
                              ? "#fff"
                              : "#000",
                            maxWidth: 270,
                          }}
                          ellipsis
                        >
                          {e.name.toLocaleUpperCase()}
                        </Typography.Text>
                      </Button>
                    </Tooltip>
                  ))}
              </Space>
            </Col>
            <Col span={1}>
              <Divider type="vertical" style={{ height: "100%" }} />
            </Col>
            <Col
              span={15}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {selectedBiller != null && getSideB(selectedBiller)}
              {
                selectedBiller != null ? (
                  // <FloatButton.Group
                  //   trigger="hover"
                  //   type="primary"
                  //   icon={<SettingOutlined />}
                  // >
                  <Space style={{ position: "absolute", right: 0, bottom: 25 }}>
                    <Popconfirm
                      title="Are you sure you want to delete this biller ?"
                      okType="primary"
                      okText="DELETE"
                      okButtonProps={{ danger: true }}
                      onConfirm={handleDeleteBiller}
                    >
                      <Button icon={<DeleteOutlined />} size="large" danger>
                        Delete Biller
                      </Button>
                    </Popconfirm>
                    {selectedTab == "form-settings-tab" && (
                      <>
                        <Button
                          icon={<PlusOutlined />}
                          size="large"
                          onClick={() =>
                            setBillsOptions({
                              open: true,
                              options: null,
                              index: -1,
                              id: null,
                            })
                          }
                        >
                          Add New Option
                        </Button>
                        <Button
                          icon={<SettingOutlined />}
                          type="primary"
                          onClick={() => setOpenUpdatedBiller(true)}
                          size="large"
                        >
                          Update Biller Name
                        </Button>
                      </>
                    )}
                    {selectedTab == "fee-settings-tab" && (
                      <>
                        <Button
                          icon={<SaveOutlined />}
                          type="primary"
                          onClick={handleSaveFee}
                          size="large"
                        >
                          Update Fee
                        </Button>
                      </>
                    )}
                  </Space>
                ) : null
                // </FloatButton.Group>
              }
            </Col>
          </Row>
        </div>
      )}

      {/* context */}
      <NewBiller
        open={openNewBiller}
        close={() => setOpenNewBiller(false)}
        onSave={(e) => {
          if (
            billers
              .map((_) => _.name)
              .filter((__) => __.toLocaleUpperCase() == e.toLocaleUpperCase())
              .length > 0
          )
            return true;

          handleNewBiller(e);
        }}
      />
      <UpdateBiller
        open={openUpdatedBiller}
        close={() => setOpenUpdatedBiller(false)}
        onSave={(e) => {
          if (
            billers
              .map((_) => _.name)
              .filter((__) => __.toLocaleUpperCase() == e.toLocaleUpperCase())
              .length > 0
          )
            return true;

          (async (_) => {
            if (selectedBiller?._id != undefined) {
              let res = await _.updateBillName(selectedBiller?._id, e);

              if (res.success) {
                message.success(res?.message ?? "Success");
                setOpenUpdatedBiller(false);
                setTrigger(trigger + 1);
              }
            }
          })(BillService);
        }}
        name={selectedBiller?.name ?? ""}
      />
      <NewOption
        open={billsOptions.open}
        close={() =>
          setBillsOptions({ open: false, options: null, index: -1, id: null })
        }
        onSave={handleNewOption}
        formfield={billsOptions.options}
        index={billsOptions.index}
        id={billsOptions.id}
        refresh={() => setTrigger(trigger + 1)}
        markAsMain={handleMarkAsMain}
        deleteOption={handleDeleteOption}
      />
    </>
  );
};

export default BillingSettings;
