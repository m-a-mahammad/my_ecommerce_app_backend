// routes/adminRoutes.ts
import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  newProductData,
  getAllProducts,
  updateProductData,
  deleteProductData,
} from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/authMiddleware";
// import { writeLimiter } from "../middleware/limiter";

const router = express.Router();
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/products", protect, adminOnly, getAllProducts);
router.put("/products/:id", protect, adminOnly, updateProductData);
router.post("/products", protect, adminOnly, newProductData);
router.delete("/products/:id", protect, adminOnly, deleteProductData);

export default router;
