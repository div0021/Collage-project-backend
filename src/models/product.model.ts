import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface ProductInput {
  user: UserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
  productId?: string;
}

export interface ProductDocument extends ProductInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
  },
  { timestamps: true }
);
const ProductModel = model<ProductDocument>("Product", productSchema);

export default ProductModel;
