import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { Request, Response } from "express";

const throwErrorHandling = (errNum: number, err: string, res?: Response) => {
  if (errNum && err && res) {
    res.status(errNum);
    throw new Error(err);
  }
};

// [GET] /api/cart
export const getCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      res.status(401);
      throw new Error("غير مصرح: لا يوجد معرف مستخدم");
    }
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.product"
    );
    if (!cart) {
      res.json({ items: [] });
      return;
    }

    res.json(cart);
  }
);

// [POST] /api/cart
export const addToCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;
    if (req.user) {
      const userId = req.user._id;
      const product = await Product.findById(productId);
      if (!product) {
        throwErrorHandling(404, "المنتج غير موجود", res);
        return;
      }

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: req.user._id,
          items: [{ product: productId, quantity }],
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity });
        }

        await cart.save();
      }

      res.status(200).json(cart);
    }
  }
);

// [PUT] /api/cart
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      const { productId, quantity } = req.body;
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        throwErrorHandling(404, "السلة غير موجودة", res);
        return;
      }

      const item = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (item) {
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
      } else {
        throwErrorHandling(404, "العنصر غير موجود في السلة", res);
        return;
      }
    }
  }
);

// [DELETE] /api/cart/:productId
export const removeFromCart = asyncHandler(async (req, res) => {
  if (req.user) {
    const { productId } = req.params;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throwErrorHandling(404, "السلة غير موجودة", res);
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  }
});

// Calculate the total for all cart items exist
export const calculateTotal = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ message: "يرجى إرسال مصفوفة items" });
      return;
    }

    const productIds = items.map((i) => i._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p._id.toString() === item._id);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);

    res.json({ total });
  }
);
