import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist";
import { Request, Response } from "express";

// جلب المفضلة حسب المستخدم
export const getWishlistByUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user) {
      const items = await Wishlist.find({ user: req.userId }).populate(
        "product"
      );
      res.json(items);
    }
  }
);

// إضافة منتج للمفضلة
export const addProductToWishlist = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      const { productId } = req.body;

      const exists = await Wishlist.findOne({
        user: req.userId,
        product: productId,
      });
      if (exists) res.status(400).json({ message: "موجود بالفعل في المفضلة" });

      const items = await Wishlist.create({
        user: req.userId,
        product: productId,
      });
      res.status(201).json(items);
    }
  }
);

// حذف منتج من المفضلة
export const deleteProductFromWishlist = asyncHandler(async (req, res) => {
  if (req.user) {
    const userId = req.user._id;
    const productId = req.params.id;

    await Wishlist.findOneAndDelete({ user: userId, product: productId });
    res.json({ message: "تم الحذف من المفضلة" });
  }
});
