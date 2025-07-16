import { sign } from "jsonwebtoken";
// controllers/authController.js
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
  deleteProfileImageService,
  getCurrentUserService,
  loginUserService,
  registerUserService,
  updatePasswordService,
  updateProfileHandlerService,
} from "../services/authServices";
import { throwErrorHandling } from "../helpers/helper";
import env from "../types/env";

// 📝 تسجيل مستخدم جديد
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, error } = await registerUserService(req.body);

    if (error || !user) {
      throwErrorHandling(400, error || "حدث خطأ غير متوقع", res);
      return;
    }

    generateTokenAndSetCookie(user._id.toString(), res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
);

// 🔐 تسجيل الدخول
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { user, error } = await loginUserService(req.body);

  if (error || !user) {
    throwErrorHandling(400, error || "حدث خطأ غير متوقع", res);
    return;
  }

  generateTokenAndSetCookie(user._id.toString(), res);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// ✅ تحديث بيانات المستخدم
export const updateProfileHandler = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const host = req.get("host") || "localhost:3000";
    if (typeof req.userId === "string" && typeof req.file !== "undefined") {
      const { user, error } = await updateProfileHandlerService(
        req.body,
        req.userId,
        req.file,
        req.protocol,
        host
      );

      if (error || !user) {
        throwErrorHandling(404, error || "حدث خطأ غير متوقع", res);
        return;
      }

      res.status(200).json(user);
    }
  }
);

// ✅ حذف بيانات المستخدم
export const deleteProfileImage = asyncHandler(
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    if (typeof req.userId === "string") {
      const { user, error } = await deleteProfileImageService(req.userId);

      if (!user || error) {
        throwErrorHandling(404, error || "المستخدم غير موجود", res);
        return;
      }

      res.status(200).json({ message: "تم حذف الصورة بنجاح", user });
    }
  }
);

// 🚪 تسجيل الخروج
export const logoutUser = asyncHandler((req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    path: "/", // ✅ مهم جدًا
  });
  res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
});

// 👤 الحصول على معلومات المستخدم الحالي
export const getCurrentUser = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (typeof req.userId === "string") {
      const { user, error } = await getCurrentUserService(req.userId);
      if (!user) {
        throwErrorHandling(404, error || "المستخدم غير موجود");
        return;
      }
      res.status(200).json(user);
    }
  }
);

// 🔁 تحديث كلمة المرور
export const updatePassword = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (typeof req.userId === "string") {
      const { user, error } = await updatePasswordService(req.body, req.userId);

      if (!user || error) {
        throwErrorHandling(400, error || "حدث خطأ غير متوقع", res);
        return;
      }

      res.status(200).json({ message: "تم تحديث كلمة المرور بنجاح" });
    }
  }
);

// 🎫 توليد التوكن وتخزينه في الكوكيز
const generateTokenAndSetCookie = (userId: string, res: Response) => {
  const token = sign({ userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    // secure: false, // لأنك على HTTP
    // sameSite: "lax", // أو "strict" مؤقتًا، بس "lax" أفضل للتوازن
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  });
};
