// server.js (ES6 version)

import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
// تحميل متغيرات البيئة
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import fs from "fs";
import path from "path";

// استدعاء المسارات
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import adminRoutes from "./routes/adminRoutes";
import wishlistRoutes from "./routes/wishlistRoute";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";

// الأنواع
import env from "./types/env";

// إعداد الخادم
const app = express();
const PORT = env.PORT;
const MONGO_URI = env.MONGO_URI;

// Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res: Response, path: string) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Debugging middleware to log incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming ${req.method} request to: ${req.originalUrl}`);
  next();
});
app.use(express.static("dist"));

// 🧱 أنشئ المسار
const uploadsDir = path.join(process.cwd(), "uploads");

// 📦 تأكد من وجود المجلد
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 تم إنشاء مجلد uploads تلقائيًا.");
}

// المسارات
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// إدارة الأخطاء
type ErrorResponse = {
  message?: string;
  error?: string;
};

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  const response: ErrorResponse = { error: err.message };
  res.status(status).json(response);
});

// الاتصال بقاعدة البيانات وتشغيل الخادم
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
    .catch((err: mongoose.Error) =>
      console.error("❌ فشل الاتصال بـ MongoDB:", err.message)
    );
}

app.listen(PORT, () =>
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`)
);
