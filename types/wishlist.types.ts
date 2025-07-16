import { Types } from "mongoose";

export interface wishlistTypes {
  user: Types.ObjectId;
  product: Types.ObjectId;
}
