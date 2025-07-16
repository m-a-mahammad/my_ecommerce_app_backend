import { Types } from "mongoose";
import { ProductTypes } from "../types/product.types"; // لو عندك توصيف للمنتج

export interface CartItem {
  product: Types.ObjectId | ProductTypes;
  quantity: number;
}

export interface CartTypes {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
