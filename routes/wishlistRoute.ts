import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware";

import {
  addProductToWishlist,
  deleteProductFromWishlist,
  getWishlistByUser,
} from "../controllers/wishlistController";
// import { readLimiter, writeLimiter } from "../middleware/limiter";

// جلب المفضلة حسب المستخدم
router.get("/", protect, getWishlistByUser);

// إضافة منتج للمفضلة
router.post("/", protect, addProductToWishlist);

// حذف منتج من المفضلة
router.delete("/:id", protect, deleteProductFromWishlist);

export default router;
