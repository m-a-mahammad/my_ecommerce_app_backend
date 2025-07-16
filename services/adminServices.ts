import User from "../models/User.js";
import Product from "../models/Product.js";
import slugify from "slugify";
import { UserTypes } from "../types/user.types.js";
import { ProductTypes } from "../types/product.types.js";

/* ✅ Get all users */
export const fetchUsers = async (): Promise<UserTypes[] | null> => {
  const users = await User.find({});
  return users.length === 0 ? null : users;
};

/* ✅ Update a user's role */
export const updateUserRoleService = async (
  id: string,
  role: string
): Promise<UserTypes | null> => {
  const user = await User.findById(id);
  if (!user) return null;

  user.role = role;
  return await user.save();
};
/* ✅ Delete a user */
export const deleteUserService = async (
  id: string
): Promise<UserTypes | null> => {
  if (!id) return null;
  const deleted = await User.findByIdAndDelete(id);
  return deleted;
};

/* ✅ Get all products */
export const getAllProductsService = async (): Promise<ProductTypes[] | null> => {
  const products = await Product.find({});
  if (products.length === 0) return null
  return products;
};

/* ✅ Create a new product */
export const createNewProductService = async (
  productData: ProductTypes
): Promise<ProductTypes | null> => {
  const { name, description, price, brand, category, stock, user, image } =
    productData;
  const newProduct = new Product({
    name,
    description,
    price: Number(price),
    brand,
    category,
    stock: Number(stock),
    slug: slugify(name, { lower: true }),
    user,
    image: {
      url: image.url,
    },
  });

  return await newProduct.save();
};

/* ✅ Update a product */
export const updateProductDataService = async (
  productData: ProductTypes,
  id: string
): Promise<ProductTypes | null> => {
  const { name, description, price, brand, category, stock, image } =
    productData;
  const product = await Product.findById(id);

  if (!product) return null;

  product.name = name;
  product.description = description;
  product.price = price;
  product.brand = brand;
  product.category = category;
  product.stock = stock;

  if (product.image && typeof image?.url === "string") {
    product.image.url = image.url;
  }
  return await product.save();
};

/* ✅ Delete a product */
export const deleteProductDataService = async (
  id: string
): Promise<ProductTypes | null> => {
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) return null;
  return deleted;
};
