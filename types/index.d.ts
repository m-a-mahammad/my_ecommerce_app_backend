import { ObjectId } from "mongoose"; // لو بتستخدم MongoDB
import { UserTypes } from "./user.types";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string | ObjectId;
    password?: string;
    user?: UserTypes | null;
    cart?: CartItem | null;
  }
}
