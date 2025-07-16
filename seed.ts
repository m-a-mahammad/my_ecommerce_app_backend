import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";

import User from "./models/User.js";
import Product from "./models/Product.js";
import { FAQ } from "./models/FAQ.js";
import { Review } from "./models/Review.js";

import users from "./data/users.js";
import products from "./data/products.js";
import faqs from "./data/faqs.js";
import reviews from "./data/reviews.js";
import env from "./types/env.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ Connected to MongoDB");
};

const importData = async () => {
  try {
    await connectDB();

    // 🧹 امسح كل البيانات القديمة
    await User.deleteMany();
    await Product.deleteMany();
    await FAQ.deleteMany();
    await Review.deleteMany();

    // 👤 أدخل المستخدمين
    const createdUsers = await User.insertMany(users);
    console.log("✅ Users created:", createdUsers.length);

    // تأكد إنه فيه مستخدمين فعلاً
    if (!createdUsers.length) {
      throw new Error("❌ No users were inserted! Check your users.js data.");
    }

    const adminUser = createdUsers[0]._id;

    // 📦 أضف Slugs للمنتجات واربطها بالمشرف
    const productsWithSlug = products.map((p) => ({
      ...p,
      user: adminUser,
      slug: slugify(p.name, { lower: true }),
    }));
    const createdProducts = await Product.insertMany(productsWithSlug);
    const productId = createdProducts[0]._id;

    // ❓ FAQs مرتبطة بأول منتج
    const faqsWithProduct = faqs.map((f) => ({ ...f, product: productId }));
    await FAQ.insertMany(faqsWithProduct);

    // ⭐ Reviews مرتبطة بالمستخدمين والمنتج
    const reviewsWithRefs = reviews.map((r, idx) => ({
      ...r,
      user: createdUsers[idx + 1]?._id || createdUsers[0]._id, // fallback
      product: productId,
    }));

    await Review.insertMany(reviewsWithRefs);

    console.log("✅ All data seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

importData();
