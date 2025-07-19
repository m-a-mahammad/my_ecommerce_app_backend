# 🛒 Ecommerce Backend API

نظام كامل لإدارة متجر إلكتروني مبني باستخدام Express و MongoDB، يدعم تسجيل المستخدمين، إدارة المنتجات، السلة، المفضلة، الدفع، ولوحة تحكم للمشرفين.

## 🚀 الخصائص
- تسجيل وتوثيق دخول المستخدمين باستخدام JWT
- إدارة كاملة للمنتجات مع رفع الصور محليًا
- نظام سلة ومفضلة متكامل
- تقييمات وأسئلة وأجوبة مرتبطة بالمنتجات
- لوحة تحكم إدارية للتحكم في المستخدمين والمنتجات
- نظام دفع متكامل باستخدام Paymob API
- حماية من الهجمات باستخدام helmet و xss-clean و mongo-sanitize
- تخزين الصور عبر multer داخل مجلد `uploads`

## 📦 التقنيات
- **Express.js** + **MongoDB** + **Mongoose**
- **JWT + bcryptjs** للمصادقة وتشفير كلمات المرور
- **multer + fs** لتخزين الصور محليًا
- **dotenv** لإدارة المتغيرات البيئية
- **CORS + cookie-parser + helmet + xss-clean + mongo-sanitize**
- **Rate Limiting** للمسارات الحساسة

## 📂 هيكل المشروع
📁 server</br>
    ├── controllers</br>
    ├── middleware</br>
    ├── models</br>
    ├── routes</br>
    ├── uploads</br>
    ├── seed.js</br>
    └── server.js


## 📮 API Endpoints (مختارة)
- `POST /api/auth/register` → تسجيل مستخدم جديد
- `POST /api/products` → إنشاء منتج جديد (Admin)
- `GET /api/products` → استعراض كل المنتجات
- `POST /api/cart` → إضافة عنصر للسلة
- `POST /api/payment/create-payment` → توليد طلب دفع
- `GET /api/wishlist` → عرض المفضلة

## 🧪 إعداد البيانات الأولية وبدء الخادم
```bash
node seed.js
npm install
npm run dev
