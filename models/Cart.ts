import { Schema, model } from "mongoose";
import { CartItem, CartTypes } from "../types/cart.types";

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const cartSchema = new Schema<CartTypes>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // كل مستخدم له سلة واحدة
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);
export default Cart;
