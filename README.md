<div align="center">

# 🛒 Ecommerce Backend API

</div>
<div dir="rtl">
نظام إدارة متجر إلكتروني متكامل مبني بـ Express + MongoDB + TypeScript، يحتوي على تسجيل الدخول،</br> سلة المشتريات، المفضلة، إدارة المنتجات، صلاحيات المشرف، والدفع الإلكتروني باستخدام Paymob.

## 🚀 الخصائص
- تسجيل وتوثيق دخول المستخدمين باستخدام JWT
- إدارة كاملة للمنتجات مع رفع الصور محليًا
- نظام سلة ومفضلة متكامل
- تقييمات وأسئلة وأجوبة مرتبطة بالمنتجات
- لوحة تحكم إدارية للتحكم في المستخدمين والمنتجات
- نظام دفع متكامل باستخدام Paymob API
- حماية من الهجمات باستخدام helmet و xss-clean و mongo-sanitize
- تخزين الصور عبر multer داخل مجلد `uploads`
- هيكلة TypeScript احترافية مع فصل واضح بين controllers, services, middleware, routes
- التحقق الصارم من البيانات البيئية باستخدام ملف env.ts لحماية الخادم من التشغيل الخاطئ
- دعم التوسعة عبر تعريف types/interfaces دقيقة لكل موديل (Cart, User, Product, إلخ)
- Seeding آلي للبيانات الأولية

## 📦 التقنيات
- **Express.js** + **MongoDB** + **Mongoose**
- **JWT + bcryptjs** للمصادقة وتشفير كلمات المرور
- **multer + fs** لتخزين الصور محليًا
- **dotenv** لإدارة المتغيرات البيئية
- **CORS + cookie-parser + helmet + xss-clean + mongo-sanitize**
- **Rate Limiting** للمسارات الحساسة
- **tsc (TypeScript Compiler)** لتحويل الكود إلى JavaScript إنتاجي

## 📂 هيكل المشروع
</div>

```json
📁 server
    ├── controllers
    ├── services
    ├── middleware
    ├── models
    ├── routes
    ├── helpers
    ├── types
    ├── uploads
    ├── seed.js
    └── server.js
```
<div dir="rtl">

## 📮 API Endpoints (مختارة)
- `POST /api/auth/register` → تسجيل مستخدم جديد
- `POST /api/products` → إنشاء منتج جديد (Admin)
- `GET /api/products` → استعراض كل المنتجات
- `POST /api/cart` → إضافة عنصر للسلة
- `POST /api/payment/create-payment` → توليد طلب دفع
- `GET /api/wishlist` → عرض المفضلة

## 🧪 إعداد البيانات الأولية وبدء الخادم
<div dir="ltr">

```bash
npm install        # تثبيت الحزم الأساسية
npm run dev        # localhost بدء السيرفر على 
npm run build      # JavaScript إلى TypeScript تحويل
npm run seed       # ملء قاعدة البيانات ببيانات تجريبية
```
</div>

</div>
