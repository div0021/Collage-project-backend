import { Document, Schema, model } from "mongoose";
import { CategoryDocument } from "./category.model";
import { UserDocument } from "./user.model";

export interface ProductInput {
  user: UserDocument["_id"];
  category: CategoryDocument["_id"];
  name: string;
  description: string;
  price: number;
  images: string[];
  subCategories:string[];
  quantity:number;
  isFeatured:boolean;
  isArchived:boolean;
  brand:string;
}

export interface ProductDocument extends ProductInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const productSchema = new Schema(
  {
    category:{
      type:Schema.Types.ObjectId,
      ref:"Category",
      require:true,
    },
    user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      require:true,
    },
    name:{type:String,required:true},
    description:{type:String,required:true},
    brand:{type:String,required:true},
    price:{type:Number,required:true},
    images:[{type:String,required:true}],
    subCategories:[{type:String}],
    quantity: { type : Number , required: true , default : 0 },
    discount: { type : Number , required: false ,default : 0 },
    isFeatured:{type:Boolean, required:true, default:false},
    isArchived:{type:Boolean, required:true, default:false},
  },
  { timestamps: true }
);
const ProductModel = model<ProductDocument>("Product", productSchema);

export default ProductModel;
