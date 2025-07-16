import { Types } from "mongoose";

export interface ProductImage {
  public_id?: string;
  url: string;
}

export interface ProductTypes {
  _id: Types.ObjectId; // لو بتستخدم toString(), ممكن تخليه string
  name: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  stock: number;
  image: ProductImage;
  user: Types.ObjectId; // أو نوع المستخدم لو بتعمل populate
  createdAt?: Date;
  updatedAt?: Date;
}
