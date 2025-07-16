// models/reviewModel.ts

import {Schema, model} from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      slug: { type: String, unique: true }
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      slug: { type: String, unique: true }
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      slug: { type: String, unique: true }
    },
    comment: {
      type: String,
      required: true,
      slug: { type: String, unique: true }
    },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);
