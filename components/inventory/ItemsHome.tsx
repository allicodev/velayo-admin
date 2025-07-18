import React, { ReactNode, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Tree,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  LeftOutlined,
} from "@ant-design/icons";

// TODO: remove white space, connect them into 1 or add smart search (smart via word and not a whole sentence)

import { BranchData, BasicContentProps, InputProps, ItemData } from "@/types";
import { parseTree, TreeNode, findAllIndicesOfSubstring } from "@/assets/ts";
import BranchChoicer from "../branch/branch_chooser";
import NewItem from "./components/new_item";
import ItemService from "@/provider/item.service";
import BranchItemHome from "./branch_items_home";
import BranchService from "@/provider/branch.service";

const ItemsHome = ({ extraData }: BasicContentProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [openNewItem, setOpenNewItem] = useState({
    open: false,
    parentId: "",
  });

  // * for search feature
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);

  // * utils
  const [_window, setWindow] = useState({ innerHeight: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [input, setInput] = useState<InputProps>({
    name: "",
    unit: undefined,
    price: 0,
    cost: 0,
  });

  // * onclick utils variables
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);

  const [openBranchChoicer, setOpenBranchChoicer] = useState<{
    open: boolean;
    branches: BranchData[];
  }>({
    open: false,
    branches: [],
  });

  const [openItemBranch, setOpenItemBranch] = useState<{
    open: boolean;
    selectedBranch: BranchData | null;
  }>({
    open: false,
    selectedBranch: null,
  });

  // * mobile
  const [width, setWidth] = useState(0);
  const isMobile = width < 600;

  const getItemName = (id: string) => items.filter((e) => e._id == id)[0].name;

  const handleSaveItem = () => {
    (async (_) => {
      let res = await _.updateItem(selectedItem?._id ?? "", input);

      if (res?.success ?? false) {
        message.success(res?.message ?? "Success");
        setSelectedItem(res?.data ?? null);

        let { name, unit, price, cost } = res?.data ?? {};
        if (!name) name = "";
        if (!unit) unit = undefined;
        if (!price) price = 0;
        if (!cost) cost = 0;
        setInput({ name, unit, price, cost });
        fetchItems();
        setIsUpdating(false);
        setIsUpdate(false);

        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
      }
    })(ItemService);
  };

  const handleItemOnAddClick = (id: string) =>
    setOpenNewItem({ open: true, parentId: id });

  const handleNewParentItem = (items: any) => {
    return (async (_) => {
      let res = await _.newItem(
        items,
        openNewItem.parentId != "" ? openNewItem.parentId : undefined
      );

      if (res.success) {
        message.success(res?.message ?? "Success");
        fetchItems();
        return true;
      } else return false;
    })(ItemService);
  };

  const fetchItems = () => {
    (async (_) => {
      let res = await _.getItems({ branchId: extraData?._id });
      if (res.success) {
        if (res?.data) {
          setItems((res?.data as ItemData[]) ?? []);
          setTreeNodes(
            buildTree(
              parseTree(res.data as ItemData[], null),
              null,
              handleItemOnAddClick,
              handlePurgeItem,
              isMobile
            )
          );
        }
      }
    })(ItemService);
  };

  const handlePurgeItem = (id: string) => {
    (async (_) => {
      let res = await _.purgeItem(id);

      if (res?.success ?? false) {
        message.success(res?.message ?? "Success");
        fetchItems();
      }
    })(ItemService);
  };

  const updateSelectedItem = (id: string) => {
    (async (_) => {
      let res = await _.getItemSpecific(id);

      if (res?.success ?? false) {
        setSelectedItem(res?.data ?? null);

        let { name, unit, price, cost } = res?.data ?? {};
        if (!name) name = "";
        if (!unit) unit = undefined;
        if (!price) price = 0;
        if (!cost) cost = 0;
        setInput({ name, unit, price, cost });
      }
    })(ItemService);
  };

  const highlightSearchItems = (search: string, isMobile: boolean) => {
    let keys: React.Key[] = [];
    const nodeUpdater = (nodes: TreeNode[]): TreeNode[] => {
      const nodeUpdate = (_node: TreeNode): TreeNode => {
        const [startIndex, lastIndex] = findAllIndicesOfSubstring(
          _node.rawTitle.toLocaleLowerCase(),
          search.toLocaleLowerCase()
        );

        const title = (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: _node.isParent ? 0 : 10,
            }}
          >
            {startIndex > -1 ? (
              <div style={{ fontSize: isMobile ? "1.4em" : "1.8em" }}>
                {startIndex != 0 ? (
                  <span>{_node.rawTitle.substring(0, startIndex)}</span>
                ) : null}
                <span style={{ color: "white", background: "#294b0f" }}>
                  {_node.rawTitle.substring(startIndex, lastIndex + 1)}
                </span>
                {!(lastIndex >= _node.rawTitle.length - 1) && (
                  <span>
                    {_node.rawTitle.slice(
                      -(_node.rawTitle.length - 1 - lastIndex)
                    )}
                  </span>
                )}
              </div>
            ) : (
              <span
                style={{
                  marginRight: 10,
                  fontSize: isMobile ? "1.4em" : "1.8em",
                }}
              >
                {_node.rawTitle}
              </span>
            )}
            {_node.isParent && (
              <Tooltip title="New Subcategory">
                <Button
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleItemOnAddClick(_node.parentId!);
                  }}
                  icon={<PlusOutlined />}
                  style={{ margin: 5 }}
                />
              </Tooltip>
            )}
          </div>
        );

        if (startIndex > -1) {
          Array(_node.key.split("-").length)
            .fill(0)
            .map((e, i) => {
              let key = _node.key
                .split("-")
                .slice(0, _node.key.split("-").length - i)
                .join("-");

              if (!keys.includes(key)) keys.push(key);
            });
          setAutoExpandParent(true);
        }

        return { ..._node, title };
      };

      nodes.forEach((e, i) => {
        if (e.children.length > 0) nodes[i].children = nodeUpdater(e.children);
        nodes[i] = nodeUpdate(e);
      });
      return nodes;
    };

    setTreeNodes(nodeUpdater(treeNodes));
    setExpandedKeys(keys);
  };

  const renderSelectedItem = (item: ItemData) => {
    const renderUpdatingCell = (index: number, e: any): ReactNode => {
      let _ = <></>;
      if (index == 0)
        _ = (
          <strong
            key={`value-${e}`}
            style={{
              fontSize: "2em",
              borderBottom: "1px solid #aaa",
              padding: 5,
              background: "#eee",
              height: 50,
            }}
          >
            {e.toLocaleUpperCase()}
          </strong>
        );

      if (index == 1)
        _ = (
          <Input
            style={{
              height: 50,
              border: "none",
              borderBottom: "1px solid #aaa",
              borderRadius: 0,
              fontSize: "2em",
              paddingLeft: 5,
            }}
            value={input.name}
            onChange={(e) => {
              setIsUpdate(true);
              setInput({ ...input, name: e.target.value });
            }}
          />
        );

      if (index == 2)
        _ = (
          <Select
            size="large"
            className="custom-item-select"
            defaultValue={item.unit}
            options={["pc(s)", "bot(s)", "kit(s)"].map((e) => ({
              label: e,
              value: e,
            }))}
            onChange={(e) => {
              setIsUpdate(true);
              setInput({ ...input, unit: e });
            }}
          />
        );

      if (index == 3)
        _ = (
          <InputNumber
            size="large"
            defaultValue={item.cost}
            style={{
              height: 50,
              border: "none",
              borderBottom: "1px solid #aaa",
              borderRadius: 0,
              fontSize: "2em",
              width: "100%",
              padding: 5,
            }}
            controls={false}
            min={0}
            onChange={(e) => {
              setIsUpdate(true);
              setInput({ ...input, cost: e ?? 0 });
            }}
          />
        );

      if (index == 4)
        _ = (
          <InputNumber
            size="large"
            defaultValue={item.price}
            style={{
              height: 50,
              border: "none",
              borderBottom: "1px solid #aaa",
              borderRadius: 0,
              fontSize: "2em",
              width: "100%",
              padding: 5,
            }}
            controls={false}
            min={0}
            onChange={(e) => {
              setIsUpdate(true);
              setInput({ ...input, price: e ?? 0 });
            }}
          />
        );

      return _;
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: isMobile ? 0 : "70vh",
        }}
      >
        <Row style={{ border: "1px solid #aaa" }}>
          <Col span={24}>
            <Typography.Title
              level={isMobile ? 3 : 2}
              style={{
                textAlign: "center",
                padding: 5,
                margin: 0,
              }}
            >
              {item.name.toLocaleUpperCase()}{" "}
            </Typography.Title>
          </Col>
          {isUpdating && (
            <Col span={24}>
              <div
                style={{
                  height: 30,
                  backgroundColor: "#1675fc",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 20,
                }}
              >
                Editing...
              </div>
            </Col>
          )}
          {showSaved && !isUpdating && (
            <Col span={24}>
              <div
                style={{
                  height: 30,
                  backgroundColor: "#28a745",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 20,
                }}
              >
                Saving...
              </div>
            </Col>
          )}
          <Col
            span={8}
            style={{
              border: "1px solid #aaa",
              borderLeft: "none",
              borderBottom: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                isMobile ? "Code" : "Item Code",
                "Name",
                "Unit",
                "Cost",
                "Price",
              ].map((e, i) => (
                <strong
                  key={e}
                  style={{
                    fontSize: isMobile ? "1.7em" : "2em",
                    borderBottom: i == 4 ? "" : "1px solid #aaa",
                    padding: 5,
                    height: 50,
                  }}
                >
                  {e.toLocaleUpperCase()}
                </strong>
              ))}
            </div>
          </Col>
          <Col
            span={16}
            style={{
              border: "1px solid #aaa",
              borderRight: "none",
              borderLeft: "none",
              borderBottom: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                `${"00000".slice(item.itemCode.toString().length)}${
                  item.itemCode
                }`,
                item.name,
                item.unit,
                item.cost,
                item.price,
              ].map((e, i) =>
                isUpdating ? (
                  renderUpdatingCell(i, e)
                ) : (
                  <Tooltip
                    title={typeof e == "string" && e.length >= 50 ? e : ""}
                  >
                    <p
                      key={`value-${i}`}
                      style={{
                        fontSize: isMobile ? "1.7em" : "2em",
                        borderBottom: i == 4 ? "" : "1px solid #aaa",
                        padding: 5,
                        background: i == 0 ? "#eee" : "",
                        maxWidth: 500,
                        height: 50,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e ? e.toString() : ""}
                    </p>
                  </Tooltip>
                )
              )}
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col span={16} offset={8}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <Popconfirm
                title="Are you sure you want to delete this item?"
                okType="danger"
                okText="DELETE"
                onConfirm={() => {
                  (async (_) => {
                    let res = await _.deleteItem(item._id);

                    if (res?.success ?? false) {
                      message.success(res?.message ?? "Success");
                      setSelectedItem(null);
                      fetchItems();
                    }
                  })(ItemService);
                }}
              >
                <Button
                  size="large"
                  icon={<DeleteOutlined />}
                  type="primary"
                  danger
                >
                  DELETE
                </Button>
              </Popconfirm>
              <Button
                size="large"
                icon={isUpdating ? <CloseOutlined /> : <EditOutlined />}
                type="primary"
                onClick={() => {
                  if (isUpdating) {
                    let { name, unit, price, cost } = selectedItem ?? {};
                    if (!name) name = "";
                    if (!unit) unit = undefined;
                    if (!price) price = 0;
                    if (!cost) cost = 0;
                    setInput({ name, unit, price, cost });
                    setIsUpdate(false);
                  }
                  setIsUpdating(!isUpdating);
                }}
              >
                {isUpdating ? "CANCEL EDIT" : "EDIT"}
              </Button>
              {isUpdate && (
                <Button
                  size="large"
                  icon={<SaveOutlined />}
                  type="primary"
                  onClick={handleSaveItem}
                >
                  SAVE
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  useEffect(() => {
    setWindow(window);
    fetchItems();

    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && selectedItem != null ? (
        <>
          <Button
            icon={<LeftOutlined />}
            size="large"
            type="text"
            style={{ width: 70, marginBottom: 10 }}
            onClick={() => setSelectedItem(null)}
          >
            BACK
          </Button>
          <div style={{ paddingLeft: 5, paddingRight: 5 }}>
            {renderSelectedItem(selectedItem)}
          </div>
        </>
      ) : (
        <div style={{ padding: 10 }}>
          <Row gutter={[16, 16]}>
            <Col span={isMobile ? 24 : 14}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <div style={{ display: "flex", width: "100%", flex: 2 }}>
                  <Input
                    size="large"
                    placeholder="Search an item..."
                    value={searchValue}
                    style={{
                      height: 55,
                      fontSize: "1.5em",
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      highlightSearchItems(e.target.value, isMobile);
                      setSelectedKey(null);
                    }}
                    allowClear
                  />
                  <Button
                    icon={<ReloadOutlined />}
                    style={{
                      width: 55,
                      height: 55,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onClick={() => {
                      setSelectedKey(null);
                      setExpandedKeys([]);
                      setAutoExpandParent(false);
                      setSearchValue("");
                      setSelectedNode(null);
                      setSelectedItem(null);
                      highlightSearchItems("", isMobile);
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: "flex", gap: 5, padding: 5 }}>
                  <Button
                    size="large"
                    style={{
                      width: isMobile ? "100%" : 140,
                      fontSize: "1.4em",
                      height: 55,
                      padding: 0,
                    }}
                    onClick={() => {
                      setSelectedKey(null);
                      setExpandedKeys([]);
                      setAutoExpandParent(false);
                      setSearchValue("");
                      setSelectedNode(null);
                      setSelectedItem(null);
                      highlightSearchItems("", isMobile);
                      new Promise(async (resolve) => {
                        let res = await BranchService.getBranch({});
                        if (res?.success ?? false) resolve(res?.data ?? []);
                      }).then((_: any) =>
                        setOpenBranchChoicer({ open: true, branches: _ })
                      );
                    }}
                  >
                    Select a Branch
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      fontWeight: "bolder",
                      width: 100,
                      fontSize: "1.4em",
                      height: 55,
                      padding: 0,
                    }}
                    onClick={() => setOpenNewItem({ open: true, parentId: "" })}
                  >
                    New
                  </Button>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <Tree
                  multiple
                  showLine
                  className="no-leaf-icon"
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  rootStyle={{
                    overflow: "scroll",
                    height: "70vh",
                    padding: 5,
                  }}
                  onSelect={(_, f) => {
                    let e = f.node.key;

                    if (
                      expandedKeys
                        .map((q) => q.toString())
                        .filter((p) =>
                          new RegExp(`^${e}(-.*)?$`).test(p.toString())
                        ).length > 0 &&
                      !f.node.isLeaf
                    ) {
                      setExpandedKeys(
                        expandedKeys.filter(
                          (p) => !new RegExp(`^${e}(-.*)?$`).test(p.toString())
                        )
                      );
                      setSelectedKey(null);
                    } else {
                      setExpandedKeys([...expandedKeys, e]);
                      setSelectedKey(e);

                      if (!f.node.isParent) {
                        setSelectedNode(f.node);
                        updateSelectedItem(f.node.id);
                      } else {
                        setSelectedItem(null);
                      }
                    }
                  }}
                  selectedKeys={[selectedKey ? selectedKey : ""]}
                  treeData={treeNodes.filter((e) =>
                    e.rawTitle
                      .toLocaleLowerCase()
                      .includes(searchValue.toLocaleLowerCase())
                  )}
                />
              </div>
            </Col>
            {!isMobile && (
              <Col span={1}>
                <Divider
                  type="vertical"
                  style={{
                    height: _window!.innerHeight - 200,
                  }}
                />
              </Col>
            )}
            <Col span={9}>
              {selectedItem && renderSelectedItem(selectedItem)}
            </Col>
          </Row>
        </div>
      )}

      {/* context */}
      <NewItem
        open={openNewItem.open}
        title={
          openNewItem.parentId != ""
            ? `New Category for Item ${getItemName(openNewItem.parentId)}`
            : "New Item/Category"
        }
        close={() => setOpenNewItem({ open: false, parentId: "" })}
        onSave={handleNewParentItem}
      />
      <BranchChoicer
        {...openBranchChoicer}
        onSelectedBranch={(e) => {
          setOpenBranchChoicer({ open: false, branches: [] });
          setOpenItemBranch({ open: true, selectedBranch: e });
        }}
        close={() => setOpenBranchChoicer({ open: false, branches: [] })}
        isMobile={isMobile}
      />
      <BranchItemHome
        open={openItemBranch.open}
        branch={openItemBranch.selectedBranch!}
        close={() => setOpenItemBranch({ open: false, selectedBranch: null })}
        updateBranch={(e) => {
          if (e) setOpenItemBranch({ open: true, selectedBranch: e });
        }}
      />
    </>
  );
};

export default ItemsHome;

// * UTILS
export function buildTree(
  items: ItemData[],
  parentId: string | null = null,
  onClick: (str: string) => void,
  purge: (str: string) => void,
  isMobile: boolean
): TreeNode[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item, index) =>
      convertToTreeNode(
        item,
        parentId ?? "",
        index,
        [],
        onClick,
        purge,
        isMobile
      )
    );
}

export function convertToTreeNode(
  item: ItemData,
  parentId: string,
  index: number,
  parentKeys: string[] = [],
  onClick: (str: string) => void,
  purge: (str: string) => void,
  isMobile: boolean
): TreeNode {
  const onClickNewSubCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(item._id);
  };

  const title = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: item.isParent ? 0 : 10,
      }}
    >
      <span style={{ marginRight: 10, fontSize: isMobile ? "1.4em" : "1.8em" }}>
        {item.name}
      </span>
      {item.isParent && (
        <div>
          <Popconfirm
            title="Deleting this will also delete all sub-categories"
            okButtonProps={{ size: "large", danger: true, type: "primary" }}
            okText="DELETE"
            cancelButtonProps={{ size: "large" }}
            onCancel={(e) => {
              e?.stopPropagation();
              e?.preventDefault();
            }}
            onConfirm={(e) => {
              e?.stopPropagation();
              e?.preventDefault();

              purge(item._id);
            }}
          >
            <Button
              size="large"
              icon={<DeleteOutlined />}
              style={{ margin: 5 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              type="primary"
              danger
            />
          </Popconfirm>
          <Tooltip title="New Subcategory">
            <Button
              size="large"
              onClick={onClickNewSubCategory}
              icon={<PlusOutlined />}
              style={{ margin: 5 }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
  const rawTitle = item.name;
  const className = "tree-title";
  const key =
    parentKeys.length > 0 ? `${parentKeys.join("-")}-${index}` : `${index}`;
  const children: TreeNode[] = item.sub_categories
    ? item.sub_categories.map((subItem, i) =>
        convertToTreeNode(
          subItem as ItemData,
          item._id,
          i,
          [...parentKeys, String(index)],
          onClick,
          purge,
          isMobile
        )
      )
    : [];
  const isLeaf = !item.sub_categories || item.sub_categories.length === 0;

  return {
    id: item._id,
    isParent: item.isParent,
    parentId,
    title,
    rawTitle,
    className,
    key,
    children,
    isLeaf,
  };
}
