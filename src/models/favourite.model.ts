import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface FavouriteInput {
  user: UserDocument["_id"];
  products: ProductDocument["_id"][];
}

export interface FavouriteDocument extends FavouriteInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const FavouriteSchema = new Schema(
  {
    products:[{type:Schema.Types.ObjectId,ref:"Product"}],
    user:{type:Schema.Types.ObjectId,ref:"User", required: true },
  },
  { timestamps: true }
);
const FavouriteModel = model<FavouriteDocument>("Favourite", FavouriteSchema);

export default FavouriteModel;
