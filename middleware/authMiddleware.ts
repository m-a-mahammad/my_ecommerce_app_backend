// middleware/authMiddleware.js
import jwt, { TokenExpiredError } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import env from "../types/env.js";
import { NextFunction, Request, Response } from "express";

// 🛡️ Authentication Middleware
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("غير مصرح: لا يوجد توكن");
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);

      if (typeof decoded === "object" && "userId" in decoded) {
        // Attach user ID separately for backward compatibility
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
          res.status(401);
          throw new Error("المستخدم غير موجود");
        }
        req.userId = req.user._id.toString();
        next();
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.error("Authentication error:", err.message);
        res.status(401);
        throw new Error("توكن غير صالح أو منتهي");
      }
    }
  }
);

// 🧑‍💼 Unified Admin Middleware
export const adminOnly = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Use existing user object if available
    const user = req.user || (await User.findById(req.userId));

    if (!user || user.role !== "admin") {
      console.log("🚨 Admin access denied for:", user?.email);
      res.status(403);
      throw new Error("ممنوع: لا تمتلك صلاحيات المشرف");
    }

    // Ensure req.user exists for subsequent middleware
    if (!req.user) req.user = user;
    next();
  }
);
