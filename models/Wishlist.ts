import { Schema, model } from "mongoose";
import { wishlistTypes } from "../types/wishlist.types";

const wishlistSchema = new Schema<wishlistTypes>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Wishlist", wishlistSchema);
