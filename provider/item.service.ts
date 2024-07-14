import Api from "./api.service";
import {
  InputProps,
  Item,
  ItemCode,
  ItemData,
  Response,
  BranchData,
  ItemWithCategory,
} from "@/types";

class ItemService {
  private readonly instance = new Api();

  public async getItems(query?: any) {
    return await this.instance.get<BranchData[] | ItemData[]>({
      endpoint: "/item/all",
      query,
    });
  }

  public async newItem(str: any, parentId?: string) {
    return await this.instance.post<Response>({
      endpoint: "/item/new",
      payload: {
        ...str,
        parentId,
      },
    });
  }

  public async getLastItemcode() {
    return await this.instance.get<ItemCode>({
      endpoint: "/item/get-last-itemcode",
    });
  }

  public async getItemSpecific(id: string) {
    return await this.instance.get<ItemData>({
      endpoint: "/item/specific",
      query: {
        id,
      },
    });
  }

  public async deleteItem(id: string) {
    return await this.instance.get<Item>({
      endpoint: "/item/delete",
      query: {
        id,
      },
    });
  }

  public async updateItem(id: string, item: InputProps) {
    return await this.instance.post<ItemData>({
      endpoint: "/item/update",
      payload: {
        ...item,
        id,
      },
    });
  }

  public async searchItem(search: string) {
    return await this.instance.get<ItemData[]>({
      endpoint: "/item/search",
      query: {
        search,
      },
    });
  }

  public async purgeItem(id: string) {
    return await this.instance.get<ItemData[]>({
      endpoint: "/item/purge-item",
      query: {
        id,
      },
    });
  }

  public async getItemsWithCategory() {
    return this.instance.get<ItemWithCategory[]>({
      endpoint: "/item/get-items",
    });
  }

  public async newCategory(name: string) {
    return this.instance.post<Response>({
      endpoint: "/item/new-category",
      payload: {
        name,
      },
    });
  }

  public async updateItemCategory(itemIds: string[], itemCategory: string) {
    return this.instance.post<Response>({
      endpoint: "/item/update-item-category",
      payload: {
        itemIds,
        itemCategory,
      },
    });
  }

  public async removeItemCategory(itemId: string) {
    return this.instance.get<Response>({
      endpoint: "/item/delete-item-category",
      query: {
        id: itemId,
      },
    });
  }

  public async deleteCategory(id: string) {
    return this.instance.get<Response>({
      endpoint: "/item/delete-category",
      query: {
        id,
      },
    });
  }
}

export default ItemService;
