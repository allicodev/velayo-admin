import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  message,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

import ItemService from "@/provider/item.service";
import NewCategory from "./components/new-category";
import AddItem from "./components/add_item";

const ItemSettings = () => {
  const [width, setWidth] = useState(0);
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const [openAddItem, setOpenAddItem] = useState<{
    open: boolean;
    id: string;
    itemsId: string[];
  }>({
    open: false,
    id: "",
    itemsId: [],
  });
  const [items, setItems] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const reload = () => setTrigger(trigger + 1);

  const onCreate = async (name: string) => {
    setLoading(true);
    let res = await ItemService.newCategory(name);

    if (res?.success ?? false) {
      setLoading(false);
      message.success(res?.message ?? "Success");
      reload();
    } else {
      setLoading(false);
      message.error(res?.message ?? "Error");
    }
  };

  const handleRemove = async (id: string) => {
    let res = await ItemService.removeItemCategory(id);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      reload();
    } else {
      message.error(res?.message ?? "Error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    let res = await ItemService.deleteCategory(id);

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      reload();
    } else {
      message.error(res?.message ?? "Error");
    }
  };

  const getItems = async () => {
    setLoading(true);

    let res = await ItemService.getItemsWithCategory();

    if (res?.success ?? false) {
      setLoading(false);
      return res?.data?.map((e, i) => ({
        key: e.name + i,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {e.name}
            <Space>
              <Popconfirm
                title="Delete Confirmation"
                okType="primary"
                okText="DELETE"
                okButtonProps={{
                  danger: true,
                }}
                onConfirm={() => handleDeleteCategory(e._id ?? "")}
              >
                <Button
                  icon={<DeleteOutlined />}
                  onClick={(_) => {
                    _.preventDefault();
                    _.stopPropagation();
                  }}
                  danger
                />
              </Popconfirm>
              <Button
                icon={<PlusOutlined />}
                onClick={(_) => {
                  _.preventDefault();
                  _.stopPropagation();
                  setOpenAddItem({
                    open: true,
                    id: e._id ?? "",
                    itemsId: e.items?.map((e: any) => e._id) ?? [],
                  });
                }}
              />
            </Space>
          </div>
        ),
        style: {
          border: "none",
          background: "#eee",
          marginBottom: 5,
        },
        children: (
          <div>
            {e.items?.map((ee: any) => (
              <div
                style={{
                  display: "flex",
                }}
              >
                <Typography.Paragraph
                  ellipsis={{
                    rows: 1,
                  }}
                  style={{
                    width: 200,
                    marginLeft: 25,
                    marginRight: 25,
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  • {ee.name}{" "}
                </Typography.Paragraph>
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => handleRemove(ee._id)}
                  shape="circle"
                  danger
                />
              </div>
            ))}
          </div>
        ),
      }));
    }
    {
      setLoading(false);
    }
    return [];
  };

  useEffect(() => {
    (async () => {
      let _ = await getItems();
      setItems(_ as any);
    })();
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, [trigger]);

  return (
    <div style={{ padding: 10 }}>
      <Spin spinning={loading}>
        <Button
          size="large"
          type="primary"
          onClick={() => setOpenNewCategory(true)}
          style={{
            margin: 5,
          }}
        >
          New Category
        </Button>
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          size="large"
          style={{
            width: 300,
            marginTop: 10,
            background: "#f6f8fb",
            padding: 5,
          }}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          items={items}
          accordion
        />

        {/* context */}
        <NewCategory
          open={openNewCategory}
          close={() => setOpenNewCategory(false)}
          onCreate={onCreate}
        />
        <AddItem
          open={openAddItem.open}
          close={() => setOpenAddItem({ open: false, id: "", itemsId: [] })}
          categoryId={openAddItem.id}
          selectedItemsIds={openAddItem.itemsId}
          refresh={() => setTrigger(trigger + 1)}
        />
      </Spin>
    </div>
  );
};

export default ItemSettings;
