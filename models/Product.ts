import { Schema, model } from "mongoose";
import slugify from "slugify";
import { ProductTypes } from "../types/product.types";

const productSchema = new Schema<ProductTypes>(
  {
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "الوصف مطلوب"],
    },
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        required: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// توليد تلقائي للـ slug
productSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Product = model("Product", productSchema);
export default Product;
