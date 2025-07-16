import asyncHandler from "express-async-handler";
import Product from "../models/Product";
import slugify from "slugify";
import { Request, Response } from "express";
import { ProductTypes } from "../types/product.types";

const productErrorHandling = (
  res: Response,
  err: string,
  product?: ProductTypes
) => {
  res.status(404);
  throw new Error(err);
};

// 🔼 POST /api/products/upload
export const uploadProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { image } = req.body;

    if (!image) {
      res.status(400);
      throw new Error("الصورة مطلوبة");
    }

    if (req.file) {
      res.status(200).json({
        public_id: req.file.filename,
        url: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`,
      });
    }
  }
);

// ➕ POST /api/products
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category, brand, image, stock } =
      req.body;

    const product = new Product({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      brand,
      image,
      stock,
      user: req.userId,
    });

    const created = await product.save();
    res.status(201).json(created);
  }
);

// 📥 GET /api/products
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.status(200).json(products);
  }
);

// ✅ GET /api/products/:slug
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slugParam = req.params.slug;
    const product = await Product.findOne({ slug: slugParam });

    if (!product) productErrorHandling(res, "المنتج غير موجود");

    res.status(200).json(product);
  }
);

// 🧾 GET /api/products/:id
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const product = await Product.findById(idParam);

    if (!product) productErrorHandling(res, "المنتج غير موجود");

    res.status(200).json(product);
  }
);

// ✏️ PUT /api/products/:id
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const product = await Product.findById(idParam);

    if (product && typeof product === "object") {
      if (!product) productErrorHandling(res, "المنتج غير موجود", product);

      const { name, description, price, category, brand, image, stock } =
        req.body;

      product.name = name || product.name;
      product.slug = slugify(name || product.name);
      product.description = description || product.description;
      product.price = price ?? product.price;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.image = image || product.image;
      product.stock = stock ?? product.stock;

      const updated = await product.save();
      res.status(200).json(updated);
    }
  }
);

// ❌ DELETE /api/products/:id
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const product = await Product.findById(idParam);
    if (product && typeof product === "object") {
      if (!product) productErrorHandling(res, "المنتج غير موجود", product);

      await Product.findByIdAndDelete(idParam);
      res.status(200).json({ message: "تم حذف المنتج" });
    }
  }
);
