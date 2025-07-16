import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  calculateTotal,
} from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";
// import { readLimiter, writeLimiter } from "../middleware/limiter";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);

router.post("/total", protect, calculateTotal);

export default router;
