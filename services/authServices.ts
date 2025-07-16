// controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { UserTypes } from "../types/user.types.js";

// 📝 تسجيل مستخدم جديد
export const registerUserService = async (
  userData: UserTypes
): Promise<{ user?: UserTypes; error?: string }> => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    return { error: "يجب إدخال البيانات المطلوبة" };
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { error: "المستخدم مسجل بالفعل" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user ? { user } : { error: "فشل في تسجيل المستخدم" };
};

// 🔐 تسجيل الدخول
export const loginUserService = async (
  userData: UserTypes
): Promise<{ user?: UserTypes; error?: string }> => {
  const { email, password } = userData;

  const user = await User.findOne({ email });

  if (!user) {
    return { error: "بيانات الدخول غير صحيحة" };
  }
  if (typeof password === "string") {
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordMatch) {
      return { error: "كلمة المرور غير صحيحة" };
    }
  }
  return { user };
};

// ✅ تحديث بيانات المستخدم
export const updateProfileHandlerService = async (
  updated: UserTypes,
  userId: string,
  file: Express.Multer.File,
  protocol: string,
  host: string
): Promise<{ user?: UserTypes; error?: string }> => {
  const user = await User.findById(userId);
  if (!user) return { error: "المستخدم غير موجود" };
  const updates = { ...updated };
  // 🧹 لو فيه صورة جديدة، إحذف القديمة
  if (file) {
    // حذف القديمة
    if (user.image?.public_id) {
      const oldPath = path.join("uploads", user.image.public_id);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("⚠️ فشل حذف الصورة القديمة:", err.message);
          else console.log("🧹 تم حذف الصورة القديمة بنجاح");
        });
      }
    }
    // إضافة الصورة الجديدة
    updates.image = {
      public_id: file.filename,
      url: `${protocol}://${host}/uploads/${file.filename}`,
    };
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  return updatedUser ? { user: updatedUser } : { error: "فشل في التحديث" };
};

// ✅ حذف بيانات المستخدم
export const deleteProfileImageService = async (
  userId: string
): Promise<{ user?: UserTypes; error?: string }> => {
  const user = await User.findById(userId);
  if (user?.image?.public_id) {
    const oldPath = path.join("uploads", user.image.public_id);
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("⚠️ فشل حذف الصورة القديمة:", err.message);
        else console.log("🧹 تم حذف الصورة القديمة بنجاح");
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $unset: { image: "" } },
    { new: true }
  ).select("-password");
  if (!updatedUser) return { error: "المستخدم غير موجود" };
  return { user: updatedUser };
};

// 👤 الحصول على معلومات المستخدم الحالي
export const getCurrentUserService = async (
  userId: string
): Promise<{ user?: UserTypes; error?: string }> => {
  const user = await User.findById(userId).select("-password");
  return user ? { user } : { error: "المستخدم غير موجود" };
};

// 🔁 تحديث كلمة المرور
export const updatePasswordService = async (
  userData: UserTypes,
  userId: string
): Promise<{ user?: UserTypes; error?: string }> => {
  const user = await User.findById(userId);
  const { currentPassword, newPassword } = userData;
  if (
    !user ||
    !(await bcrypt.compare(currentPassword as string, user.password as string))
  ) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }
  user.password = await bcrypt.hash(newPassword as string, 10);
  await user.save();
  return { user };
};
