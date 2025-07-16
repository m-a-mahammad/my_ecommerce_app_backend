// models/faqModel.ts

import { Schema, model } from "mongoose";

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      slug: { type: String, unique: true },
    },
    answer: {
      type: String,
      required: true,
      slug: { type: String, unique: true },
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", // اختيارية لو الأسئلة بتكون مرتبطة بمنتج معين
      slug: { type: String, unique: true },
    },
  },
  { timestamps: true }
);

export const FAQ = model("FAQ", faqSchema);
