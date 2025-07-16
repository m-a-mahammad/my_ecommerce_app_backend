import { Response } from "express";

// ✅ دالة التعامل مع الخطأ
export const UserProductErrorHandling = <T>(
  res: Response,
  resource: T | null | undefined,
  errNum: number,
  err: string
): resource is T => {
  if (!resource) {
    res.status(errNum).json({ error: err });
    return false;
  }
  return true;
};

export const throwErrorHandling = (
  errNum: number,
  err: string,
  res?: Response
) => {
  if (errNum && err && res) {
    res.status(errNum);
    throw new Error(err);
  }
};

// ✅ دالة الاستجابة العامة
export const UserProductResponse = <T>(
  res: Response,
  msg: string,
  data?: T | null | undefined
): data is T => {
  if (!data) {
    res.json({ message: msg });
    return false;
  }
  res.json({ message: msg, data });
  return true;
};

// messages.ts
export const Messages = {
  USERS_GOTTEN_SUCESSFULLY: "✅ تم جلب المستخدمين بنجاح",
  PRODUCTS_GOTTEN_SUCESSFULLY: "✅ تم جلب المنتجات بنجاح",

  USER_NOT_FOUND: "المستخدم غير موجود",
  PRODUCT_NOT_FOUND: "لم يتم العثور على المنتج",

  ID_NOT_FOUND: "المعرّف مفقود",

  PRODUCT_CREATED: "✅ تم إنشاء المنتج",
  USER_PRODUCT_UPDATED: "✅ تم التحديث بنجاح",

  USER_DELETED: "✅ تم حذف المستخدم بنجاح",
  PRODUCT_DELETED: "✅ تم حذف المنتج بنجاح",

  ERROROCCURS: "حدث خطأ من جانب الخادم، يرجى المحاولة لاحقًا",
};
