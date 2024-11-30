import API from "./api.service";
import {
  InputProps,
  Item,
  ItemCode,
  ItemData,
  Response,
  BranchData,
  ItemWithCategory,
} from "@/types";

abstract class ItemService {
  public static async getItems(query?: any) {
    return await API.get<BranchData[] | ItemData[]>({
      endpoint: "/item/all",
      query,
    });
  }

  public static async newItem(str: any, parentId?: string) {
    return await API.post<Response>({
      endpoint: "/item/new",
      payload: {
        ...str,
        parentId,
      },
    });
  }

  public static async getLastItemcode() {
    return await API.get<ItemCode>({
      endpoint: "/item/get-last-itemcode",
    });
  }

  public static async getItemSpecific(id: string) {
    return await API.get<ItemData>({
      endpoint: "/item/specific",
      query: {
        id,
      },
    });
  }

  public static async deleteItem(id: string) {
    return await API.get<Item>({
      endpoint: "/item/delete",
      query: {
        id,
      },
    });
  }

  public static async updateItem(id: string, item: InputProps) {
    return await API.post<ItemData>({
      endpoint: "/item/update",
      payload: {
        ...item,
        id,
      },
    });
  }

  public static async searchItem(search: string) {
    return await API.get<ItemData[]>({
      endpoint: "/item/search",
      query: {
        search,
      },
    });
  }

  public static async purgeItem(id: string) {
    return await API.get<ItemData[]>({
      endpoint: "/item/purge-item",
      query: {
        id,
      },
    });
  }

  public static async getItemsWithCategory() {
    return API.get<ItemWithCategory[]>({
      endpoint: "/item/get-items",
    });
  }

  public static async newCategory(name: string) {
    return API.post<Response>({
      endpoint: "/item/new-category",
      payload: {
        name,
      },
    });
  }

  public static async updateItemCategory(
    itemIds: string[],
    itemCategory: string
  ) {
    return API.post<Response>({
      endpoint: "/item/update-item-category",
      payload: {
        itemIds,
        itemCategory,
      },
    });
  }

  public static async removeItemCategory(itemId: string) {
    return API.get<Response>({
      endpoint: "/item/delete-item-category",
      query: {
        id: itemId,
      },
    });
  }

  public static async deleteCategory(id: string) {
    return API.get<Response>({
      endpoint: "/item/delete-category",
      query: {
        id,
      },
    });
  }
}

export default ItemService;
