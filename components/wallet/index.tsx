import React, { Children, ReactNode, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  InputNumber,
  Radio,
  Row,
  Space,
  Typography,
  Modal,
  message,
  Input,
  Tabs,
  Card,
  Tooltip,
  Alert,
  Popconfirm,
  FloatButton,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  LeftOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  BillingsFormField,
  OptionTypeWithFlag,
  Wallet,
  WalletType,
} from "@/types";
import { NewWallet, NewOption } from "../modals";
import WalletService from "@/provider/wallet.service";
import { FloatLabel } from "@/assets/ts";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import PrinterException from "../printer_exception";
import ThresholdFees from "./components/ThresholdFees";

const EWalletSettings = () => {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openNewWallet, setOpenNewWallet] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [updated, setUpdated] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchKey, setSearchKey] = useState("");
  const [walletOptions, setWalletOptions] = useState<OptionTypeWithFlag>({
    open: false,
    options: null,
    index: -1,
    id: null,
  });
  const [walletType, setWalletType] = useState("fixed-percentage");

  // for context
  const [contextName, setContextName] = useState("");
  const [openUpdateName, setOpenUpdateName] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState("fee-settings-tabs");

  // * mobile
  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

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

  const clearAll = () => {
    setSelectedWallet(null);
    close();
  };

  console.log("la-logs walletType", walletType);
  console.log("la-logs selectedWallet", selectedWallet?.cashoutFeeType);

  const handleUpdateWalletType = (
    type: "cash-in" | "cash-out",
    feeType: string
  ) => {
    (async (_) => {
      if (selectedWallet?._id) {
        const res = await _.updateWalletType(selectedWallet._id, type, feeType);

        if (res?.success ?? false) {
          message.success(res?.message ?? "Success");
          setSelectedWallet({
            ...selectedWallet,
            [type == "cash-in" ? "cashinFeeType" : "cashoutFeeType"]: feeType,
          });
        } else {
          message.error(res?.message ?? "Error");
        }
      }
    })(WalletService);
  };

  const cashinHasNoMainAMount = () =>
    selectedWallet?.cashInFormField
      .filter((e) => e.type == "number")
      .map((e) => e.inputNumberOption?.mainAmount)
      .filter((e) => e == true).length == 0;
  const cashoutHasNoMainAMount = () =>
    selectedWallet?.cashOutFormField
      .filter((e) => e.type == "number")
      .map((e) => e.inputNumberOption?.mainAmount)
      .filter((e) => e == true).length == 0;

  const getTabsAsWalletType = (): WalletType =>
    selectedTabs == "cashin-settings-tabs" ? "cash-in" : "cash-out";

  const renderSettingsForm = (_wallet: Wallet, type: WalletType) => {
    const selectedFormField: BillingsFormField[] =
      type == "cash-in" ? _wallet.cashInFormField : _wallet.cashOutFormField;

    const billingButton = (formField: BillingsFormField): ReactNode => {
      let index = selectedFormField?.indexOf(formField) ?? -1;

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
                setWalletOptions({
                  open: true,
                  options: selectedFormField![index ?? -1],
                  index,
                  id: selectedWallet?._id ?? null,
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
      <div>
        <Typography.Title>{_wallet.name} Fee Settings</Typography.Title>
        {cashinHasNoMainAMount() && (
          <Alert
            type="error"
            message="There are no main amount selected on Cash-In."
            style={{
              marginBottom: 5,
              width: 280,
            }}
          />
        )}
        {cashoutHasNoMainAMount() && (
          <Alert
            type="error"
            message="There are no main amount selected on Cash-out."
            style={{
              marginBottom: 5,
              width: 290,
            }}
          />
        )}
        <Card
          styles={{
            body: {
              padding: 5,
              background: "#fefefe",
              borderRadius: 10,
            },
          }}
        >
          <Tabs
            type="card"
            onChange={(e) => {
              setSelectedTabs(e);
              setWalletType("threshold");
            }}
            items={[
              {
                label: "Cash-in Settings",
                key: "cashin-settings-tabs",
                children: selectedFormField?.length != 0 && (
                  <Tabs
                    type="card"
                    items={[
                      {
                        label: "Forms",
                        key: "forms",
                        children: (
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

                                if (selectedFormField && selectedWallet) {
                                  const items = reorder(
                                    selectedFormField,
                                    result.source.index,
                                    result.destination.index
                                  );

                                  let _: Wallet = {
                                    ...selectedWallet,
                                    cashInFormField: items,
                                  };

                                  // call api and update the current option position
                                  (async (b) => {
                                    if (selectedWallet?._id != undefined) {
                                      let res = await b.updateWalletOption(
                                        selectedWallet._id,
                                        _
                                      );

                                      if (res.success)
                                        message.success(
                                          res?.message ?? "Success"
                                        );
                                    }
                                  })(WalletService);

                                  setSelectedWallet(_);
                                }
                              }}
                            >
                              <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {selectedFormField?.map((item, index) => (
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
                        key: "fee-settings",
                        children: (
                          <Tabs
                            type="card"
                            style={{ width: "100%" }}
                            tabBarExtraContent={
                              (walletType == "threshold" &&
                                selectedWallet?.cashinFeeType == "threshold") ||
                              (walletType == "fixed-percentage" &&
                                selectedWallet?.cashinFeeType ==
                                  "fixed-percentage") ? (
                                <Typography.Text type="success">
                                  Selected Fee Settings
                                </Typography.Text>
                              ) : (
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handleUpdateWalletType(
                                      "cash-in",
                                      walletType
                                    )
                                  }
                                >
                                  Use as Fee Settings
                                </Button>
                              )
                            }
                            onChange={setWalletType}
                            activeKey={walletType}
                            items={[
                              {
                                label: "Fixed/Percentage Fee Settings",
                                key: "fixed-percentage",
                                children: (
                                  <div>
                                    <Radio.Group
                                      style={{
                                        marginLeft: 15,
                                      }}
                                      onChange={(e) => {
                                        setSelectedWallet({
                                          ..._wallet,
                                          cashinType: e.target.value,
                                        });
                                        setUpdated(true);
                                      }}
                                      value={_wallet.cashinType}
                                    >
                                      <Radio value="percent">Percent</Radio>
                                      <Radio value="fixed">Fixed</Radio>
                                    </Radio.Group>
                                    <FloatLabel
                                      label="Fee"
                                      value={selectedWallet?.cashinFeeValue?.toString()}
                                      style={{
                                        marginLeft: 15,
                                        marginTop: 5,
                                      }}
                                    >
                                      <InputNumber
                                        prefix={
                                          _wallet.cashinType == "percent"
                                            ? "%"
                                            : "₱"
                                        }
                                        value={_wallet.cashinFeeValue}
                                        className="customInput"
                                        size="large"
                                        style={{
                                          width: 120,
                                        }}
                                        onChange={(e) => {
                                          setSelectedWallet({
                                            ..._wallet,
                                            cashinFeeValue: e,
                                          });
                                          setUpdated(true);
                                        }}
                                        controls={false}
                                      />
                                    </FloatLabel>

                                    <Button
                                      size="large"
                                      type="primary"
                                      icon={<SaveOutlined />}
                                      disabled={!updated}
                                      style={{
                                        width: 120,
                                        marginLeft: 15,
                                      }}
                                      onClick={handleSave}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                ),
                              },
                              {
                                label: "Threshold Fee Settings",
                                key: "threshold",
                                children: (
                                  <ThresholdFees
                                    walletId={selectedWallet?._id}
                                    subType="cash-in"
                                  />
                                ),
                              },
                            ]}
                          />
                        ),
                      },
                    ]}
                  />
                ),
              },
              {
                label: "Cash-out Settings",
                key: "cashout-settings-tabs",
                children: selectedFormField?.length != 0 && (
                  <Tabs
                    type="card"
                    items={[
                      {
                        label: "Forms",
                        key: "forms",
                        children: (
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

                                if (selectedFormField && selectedWallet) {
                                  const items = reorder(
                                    selectedFormField,
                                    result.source.index,
                                    result.destination.index
                                  );

                                  let _: Wallet = {
                                    ...selectedWallet,
                                    cashOutFormField: items,
                                  };

                                  // call api and update the current option position
                                  (async (b) => {
                                    if (selectedWallet?._id != undefined) {
                                      let res = await b.updateWalletOption(
                                        selectedWallet._id,
                                        _
                                      );

                                      if (res.success)
                                        message.success(
                                          res?.message ?? "Success"
                                        );
                                    }
                                  })(WalletService);

                                  setSelectedWallet(_);
                                }
                              }}
                            >
                              <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {selectedFormField?.map((item, index) => (
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
                        key: "fee-settings-tabs",
                        children: (
                          <Tabs
                            type="card"
                            tabBarExtraContent={
                              (walletType == "threshold" &&
                                selectedWallet?.cashoutFeeType ==
                                  "threshold") ||
                              (walletType == "fixed-percentage" &&
                                selectedWallet?.cashoutFeeType ==
                                  "fixed-percentage") ? (
                                <Typography.Text type="success">
                                  Selected Fee Settings
                                </Typography.Text>
                              ) : (
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handleUpdateWalletType(
                                      "cash-out",
                                      walletType
                                    )
                                  }
                                >
                                  Use as Fee Settings
                                </Button>
                              )
                            }
                            onChange={setWalletType}
                            items={[
                              {
                                label: "Fixed/Percentage Fee Settings",
                                key: "fixed-percentage",
                                children: (
                                  <div>
                                    <Radio.Group
                                      style={{
                                        marginLeft: 15,
                                      }}
                                      onChange={(e) => {
                                        setSelectedWallet({
                                          ..._wallet,
                                          cashoutType: e.target.value,
                                        });
                                        setUpdated(true);
                                      }}
                                      value={_wallet.cashoutType}
                                    >
                                      <Radio value="percent">Percent</Radio>
                                      <Radio value="fixed">Fixed</Radio>
                                    </Radio.Group>

                                    <FloatLabel
                                      label="Fee"
                                      value={selectedWallet?.cashoutFeeValue?.toString()}
                                      style={{
                                        marginLeft: 15,
                                        marginTop: 5,
                                      }}
                                    >
                                      <InputNumber
                                        prefix={
                                          _wallet.cashoutType == "percent"
                                            ? "%"
                                            : "₱"
                                        }
                                        value={_wallet.cashoutFeeValue}
                                        className="customInput"
                                        size="large"
                                        style={{
                                          width: 120,
                                        }}
                                        onChange={(e) => {
                                          setSelectedWallet({
                                            ..._wallet,
                                            cashoutFeeValue: e,
                                          });
                                          setUpdated(true);
                                        }}
                                        controls={false}
                                      />
                                    </FloatLabel>
                                  </div>
                                ),
                              },
                              {
                                label: "Threshold Fee Settings",
                                key: "threshold",
                                children: (
                                  <ThresholdFees
                                    walletId={selectedWallet?._id}
                                    subType="cash-out"
                                  />
                                ),
                              },
                            ]}
                          />
                        ),
                      },
                    ]}
                  />
                ),
              },

              ...(!isMobile
                ? [
                    {
                      label: "Print Exception Settings (Cash-In)",
                      key: "printer-exception-settings-cash-in",
                      children: (
                        <PrinterException
                          wallet={selectedWallet ?? null}
                          walletKey="cash-in"
                          refresh={() => setTrigger(trigger + 1)}
                        />
                      ),
                    },
                    {
                      label: "Print Exception Settings (Cash-Out)",
                      key: "printer-exception-settings-cash-out",
                      children: (
                        <PrinterException
                          wallet={selectedWallet ?? null}
                          walletKey="cash-out"
                          refresh={() => setTrigger(trigger + 1)}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Card>
      </div>
    );
  };

  const getWallets = () => {
    (async (_) => {
      let res = await _.getWallet();
      if (res.success) {
        setWallets(res?.data ?? []);

        if (selectedWallet != null) {
          if (res.data)
            setSelectedWallet(res.data[wallets.indexOf(selectedWallet)]);
        }
      }
    })(WalletService);
  };

  const handleNewWallet = async (_wallet: Wallet): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (
        wallets
          .map((e) => e.name)
          .filter(
            (e) => e.toLocaleLowerCase() == _wallet?.name.toLocaleLowerCase()
          ).length > 0
      ) {
        reject("Wallet already added");
        return;
      }

      (async (_) => {
        let res = await _.newWallet(_wallet);

        if (res.success) {
          message.success(res?.message ?? "Success");
          setTrigger(trigger + 1);
          resolve("Successfully Added");
        } else reject("Error in the server.");
      })(WalletService);
    });
  };

  const handleUpdateName = () => {
    (async (_) => {
      if (selectedWallet?._id) {
        let res = await _.updateName(selectedWallet?._id, contextName);
        if (res.success) {
          message.success(res?.message ?? "Success");
          setOpenUpdateName(false);
          setTrigger(trigger + 1);
        }
      }
    })(WalletService);
  };

  const handleSave = () => {
    (async (_) => {
      if (selectedWallet) {
        let res = await _.updateWalletFee(selectedWallet);
        if (res.success) {
          message.success(res?.message ?? "Success");
          setTrigger(trigger + 1);
        }
      }
    })(WalletService);
  };

  const handleNewOption = (opt: BillingsFormField) => {
    if (walletOptions.options != null) {
      (async (_) => {
        if (selectedWallet?._id != undefined) {
          let res = await _.updateWalletFormFields(
            selectedWallet?._id,
            opt,
            selectedIndex,
            getTabsAsWalletType()
          );

          if (res.success) {
            setWalletOptions({
              open: false,
              options: null,
              index: -1,
              id: null,
            });
            setTrigger(trigger + 1);
            message.success(res?.message ?? "Success");
          }
        }
      })(WalletService);
    } else {
      (async (_) => {
        if (selectedWallet?._id != undefined) {
          let res = await _.pushToFormFields(
            selectedWallet?._id,
            opt,
            getTabsAsWalletType()
          );

          if (res.success) {
            setWalletOptions({
              open: false,
              options: null,
              index: -1,
              id: null,
            });
            setTrigger(trigger + 1);
            message.success(res?.message ?? "Success");
          }
        }
      })(WalletService);
    }
  };

  const handleMarkAsMain = (id: string, index: number) => {
    return (async (_) => {
      if (id) {
        let res = await _.markWalletMainAmount(
          id,
          index,
          getTabsAsWalletType()
        );

        if (res.success) {
          message.success(res?.message ?? "Success");
          return true;
        }
      }
    })(WalletService);
  };

  const handleDeleteOption = (id: string, index: number) => {
    return (async (_) => {
      if (id) {
        let res = await _.removeWalletOptionIndexed(
          id,
          index,
          getTabsAsWalletType()
        );

        if (res.success) {
          message.success(res?.message ?? "Success");
          return true;
        }
      }
    })(WalletService);
  };
  const handleDeleteWallet = () => {
    (async (_) => {
      let res = await _.deleteWallet(selectedWallet?._id ?? "");
      if (res?.success ?? false) {
        setTrigger(trigger + 1);
        setSelectedWallet(null);
        message.success(res?.message ?? "Success");
      }
    })(WalletService);
  };

  useEffect(() => {
    getWallets();
  }, [open, trigger]);

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
      {isMobile && selectedWallet != null ? (
        <>
          <>
            <Button
              icon={<LeftOutlined />}
              size="large"
              type="text"
              style={{ width: 70, marginBottom: 10 }}
              onClick={() => setSelectedWallet(null)}
            >
              BACK
            </Button>
            {renderSettingsForm(selectedWallet, getTabsAsWalletType())}
            <FloatButton.Group
              trigger="click"
              type="primary"
              shape="square"
              icon={<SettingOutlined />}
            >
              <Popconfirm
                title="Are you sure you want to delete this wallet ?"
                okType="primary"
                okText="DELETE"
                okButtonProps={{ danger: true }}
                onConfirm={handleDeleteWallet}
              >
                <FloatButton
                  icon={<DeleteOutlined style={{ color: "#f00" }} />}
                />
              </Popconfirm>
              {selectedTabs == "fee-settings-tabs" && (
                <>
                  <FloatButton
                    icon={<SettingOutlined />}
                    onClick={() => setOpenUpdateName(true)}
                  />
                  <FloatButton
                    icon={<SaveOutlined />}
                    type="primary"
                    onClick={updated ? handleSave : undefined}
                  />
                </>
              )}
              {["cashin-settings-tabs", "cashout-settings-tabs"].includes(
                selectedTabs
              ) && (
                <FloatButton
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setWalletOptions({
                      open: true,
                      options: null,
                      index: -1,
                      id: null,
                    });
                  }}
                />
              )}
            </FloatButton.Group>
          </>
        </>
      ) : (
        <Row
          style={{
            padding: isMobile ? "10px 5px" : 10,
          }}
        >
          <Col span={isMobile ? 24 : 8}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginBottom: 25,
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
                    setSelectedWallet(null);
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
                      setSelectedWallet(null);
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
                onClick={() => setOpenNewWallet(true)}
                key="add-btn"
                style={{
                  height: 50,
                }}
              >
                New Wallet
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
              {wallets
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
                        ? "This Wallet is under maintenance"
                        : e.name.length > 20
                        ? e.name
                        : ""
                    }
                    key={`btn-btn-${i}`}
                  >
                    <Button
                      key={`wallet-btn-${i}`}
                      disabled={e.isDisabled}
                      style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        height: 60,
                        background: e.isDisabled
                          ? "#eee"
                          : selectedWallet?._id == e._id
                          ? "#294B0F"
                          : "#fff",
                      }}
                      onClick={() => {
                        setSelectedTabs("cashin-settings-tabs");
                        setSelectedWallet(e);
                      }}
                      block
                    >
                      <Typography.Text
                        style={{
                          fontSize: 30,
                          color: e.isDisabled
                            ? "#aaa"
                            : selectedWallet?._id == e._id
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
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {selectedWallet != null &&
              renderSettingsForm(selectedWallet, getTabsAsWalletType())}
            {selectedWallet != null && walletType != "threshold" && (
              <Space
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 25,
                }}
              >
                <Popconfirm
                  title="Are you sure you want to delete this wallet ?"
                  okType="primary"
                  okText="DELETE"
                  okButtonProps={{ danger: true }}
                  onConfirm={handleDeleteWallet}
                >
                  <Button icon={<DeleteOutlined />} size="large" danger>
                    Delete Biller
                  </Button>
                </Popconfirm>
                {selectedTabs == "fee-settings-tabs" && (
                  <>
                    <Button
                      size="large"
                      type="primary"
                      ghost
                      style={{
                        width: 150,
                      }}
                      onClick={() => setOpenUpdateName(true)}
                    >
                      Update Name
                    </Button>
                  </>
                )}
                {["cashin-settings-tabs", "cashout-settings-tabs"].includes(
                  selectedTabs
                ) && (
                  <Button
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => {
                      setWalletOptions({
                        open: true,
                        options: null,
                        index: -1,
                        id: null,
                      });
                    }}
                  >
                    Add New Option
                  </Button>
                )}
              </Space>
            )}
          </Col>
        </Row>
      )}

      {/* context */}
      <Modal
        open={openUpdateName}
        onCancel={() => setOpenUpdateName(false)}
        closable={false}
        title="Update Name"
        footer={[
          <Button
            key="footer-key"
            onClick={handleUpdateName}
            type="primary"
            size="large"
          >
            Update
          </Button>,
        ]}
      >
        <FloatLabel label="Name" value={contextName}>
          <Input
            className="customInput"
            onChange={(e) => setContextName(e.target.value)}
            size="large"
          />
        </FloatLabel>
      </Modal>
      <NewWallet
        open={openNewWallet}
        close={() => setOpenNewWallet(false)}
        onSave={handleNewWallet}
      />
      <NewOption
        open={walletOptions.open}
        close={() =>
          setWalletOptions({ open: false, options: null, index: -1, id: null })
        }
        onSave={handleNewOption}
        formfield={walletOptions.options}
        index={walletOptions.index}
        id={walletOptions.id}
        refresh={() => setTrigger(trigger + 1)}
        markAsMain={handleMarkAsMain}
        deleteOption={handleDeleteOption}
      />
    </>
  );
};

export default EWalletSettings;
