import express from "express";
const router = express.Router();
// استدعاء المتحكمات (هنعمل الملفات دي قريبًا)
import {
  registerUser,
  loginUser,
  updateProfileHandler,
  logoutUser,
  getCurrentUser,
  updatePassword,
  deleteProfileImage,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
// import { readLimiter, writeLimiter } from "../middleware/limiter";

import multer from "multer";
import path from "path";

type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const isValid = allowedTypes.includes(file.mimetype);
  if (isValid) {
    cb(null, true); // ✅ الملف مقبول
  } else {
    cb(new Error("❌ يُسمح فقط بصيغة JPEG أو PNG أو WebP"), false); // ❌ الملف مرفوض
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 2 * 1024 * 1024 }, // 🔐 حد أقصى 2MB (اختياري)
});

// ✅ المسارات
router.post("/register", registerUser); // تسجيل مستخدم جديد
router.post("/login", loginUser); // تسجيل الدخول
router.post("/logout", logoutUser); // تسجيل الخروج
router.get("/me", protect, getCurrentUser); // جلب بيانات المستخدم المسجل (Protected)
router.put("/me", protect, upload.single("image"), updateProfileHandler);
router.put("/update-password", protect, updatePassword); // تحديث كلمة المرور (Protected)
router.delete("/me", protect, deleteProfileImage);

export default router;
