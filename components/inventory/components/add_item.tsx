import React, { useState } from "react";
import { AutoComplete, Button, message, Modal, Table, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ItemData } from "@/types";
import { useItemStore } from "@/provider/context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/provider/redux/store";
import { newItem, removeItem, purgeItems } from "@/provider/redux/itemSlice";
import ItemService from "@/provider/item.service";

interface MyProps {
  open: boolean;
  close: () => void;
  categoryId: string;
  selectedItemsIds: string[];
  refresh: () => void;
}

const AddItem = ({
  open,
  close,
  categoryId,
  selectedItemsIds,
  refresh,
}: MyProps) => {
  const [searchWord, setSearchWord] = useState("");
  const [items, setItems] = useState<ItemData[]>([]);
  const itemService = new ItemService();

  const { items: lcItems } = useItemStore();
  const selectedItem = useSelector((state: RootState) => state.branchItem);
  const dispatch = useDispatch<AppDispatch>();

  const closeAll = () => {
    dispatch(purgeItems());
    close();
  };

  const searchItem = (keyword?: string) => {
    setItems(
      lcItems.filter((e) =>
        e.name.toLocaleLowerCase().includes(keyword?.toLocaleLowerCase() ?? "")
      )
    );
  };

  const update = async () => {
    let res = await itemService.updateItemCategory(
      selectedItem.map((e) => e._id!),
      categoryId
    );

    if (res?.success ?? false) {
      message.success(res?.message ?? "Success");
      refresh();
      closeAll();
    } else {
      message.error(res?.message ?? "Error");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={closeAll}
      footer={
        <Button
          type="primary"
          size="large"
          disabled={selectedItem.length == 0}
          onClick={update}
        >
          Update
        </Button>
      }
      closable={false}
    >
      <AutoComplete
        size="large"
        style={{ width: "100%" }}
        value={searchWord}
        filterOption={(inputValue, option) =>
          option!
            .value!.toString()
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1
        }
        options={items
          // .filter((e) => selectedItem.map((_) => _._id).some((_) => _ == e._id)) // ! not working
          .map((e) => ({
            label: e.name,
            value: e.name,
            key: e._id,
          }))}
        onChange={(e) => {
          searchItem(e);
          setSearchWord(e);
        }}
        onSelect={(_, __) => {
          if (
            selectedItem.some((e) => e.name == __.label) ||
            selectedItemsIds.includes(__.key)
          ) {
            message.warning("Already added");
          } else dispatch(newItem(lcItems.filter((e) => e._id == __.key)[0]));
          setSearchWord("");
        }}
      />

      {selectedItem.length > 0 && (
        <Table
          locale={{ emptyText: " " }}
          dataSource={selectedItem}
          pagination={false}
          rowKey={(e) => e.name}
          style={{ marginTop: 10 }}
          columns={[
            {
              title: "Item Code",
              dataIndex: "itemCode",
              width: 150,
              align: "center",
              render: (_) => `${"00000".slice(_.toString().length)}${_}`,
            },
            { title: "Name", dataIndex: "name", width: 300 },
            {
              width: 1,
              render: (_: any, row: any) => (
                <Tooltip title="Remove Item">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(removeItem(row.name))}
                    danger
                  />
                </Tooltip>
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default AddItem;
