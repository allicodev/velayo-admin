import { ItemUnit, User } from "./schema.interface";

export interface ItemState {
  _id?: string;
  name: string;
  itemCode: number;
  unit: ItemUnit;
  currentQuantity: number;
  quantity: number;
  parentName: string;
  price: number;
  cost: number;
}

export interface ItemBranchState {
  _id?: string;
  name: string;
  itemCode: number;
  price: number;
}

export interface TellerState {
  data: User[];
}

export interface FilterState {
  [key: string]: any;
}
