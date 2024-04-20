import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface CartInput {
  user: UserDocument["_id"];
  products: [ProductDocument["_id"]];
}

export interface CartDocument extends CartInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const cartSchema = new Schema(
  {
    products:{type:[{data:{type:Schema.Types.ObjectId,ref:"Product"},quantity:{type:Number,default:1}}],required:true,default:[]} ,
    user:{type:Schema.Types.ObjectId,ref:"User", required: true },
  },
  { timestamps: true }
);
const CartModel = model<CartDocument>("Cart", cartSchema);

export default CartModel;
