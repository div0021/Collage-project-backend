import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface CategoryInput {
  user: UserDocument["_id"];
  name: string;
  subCategories: string[];
  description?:string;
}

export interface CategoryDocument extends CategoryInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const CategorySchema = new Schema(
  {
    name:{type:String,required:true,unique:true},
    user:{type:Schema.Types.ObjectId,ref:"User", required: true },
    subCategories:{type: [String], required: true },
    description:{type:String},
  },
  { timestamps: true }
);
const CategoryModel = model<CategoryDocument>("Category", CategorySchema);

export default CategoryModel;
