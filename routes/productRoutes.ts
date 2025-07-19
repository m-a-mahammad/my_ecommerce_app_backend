// routes/productRoutes
import express from "express";
const router = express.Router();

// المتحكمات الخاصة بالمنتجات (هنبنيها قريبًا)
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  /* getProductById, */
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../controllers/productController";

// middleware لحماية المسارات والتحقق من الصلاحيات
import { adminOnly, protect } from "../middleware/authMiddleware";
// import { readLimiter, writeLimiter } from "../middleware/limiter";

// ✅ مسارات إدارة المنتجات

// جلب كل المنتجات
router.get("/", getAllProducts);

// جلب منتج واحد بالتفصيل
router.get("/:slug", getProductBySlug); // ✅ لازم قبل "/:id"
/* router.get("/:id", getProductById); */

// إضافة منتج (Admin فقط)
router.post("/", protect, adminOnly, createProduct);

// تعديل منتج (Admin فقط)
router.put("/:id", protect, adminOnly, updateProduct);

// حذف منتج (Admin فقط)
router.delete("/:id", protect, adminOnly, deleteProduct);

// رفع صورة المنتج (مثلاً باستخدام multer)
router.post("/upload", protect, uploadProductImage);

export default router;
