import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface OrderInput {
  user: UserDocument["_id"];
  products: [{data:ProductDocument["_id"],quantity:number}];
  razorpay_order_id:string;
  amount:number;
  shipment:number;
  address:{
    address:string;
    pincode:number;
    city:string;
    state:string;
  }
}

export interface OrderDocument extends OrderInput, Document {
  razorpay_payment_id:string;
  razorpay_signature:string;
  isPaymentLegit:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    products: [{data:{ type: Schema.Types.ObjectId, ref: "Product" },quantity:{type:Number,required:true,default:1}}],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    razorpay_order_id:{
      type:String,
      required:true,
      unique:true,
    },
    razorpay_payment_id:{
      type:String,
    },
    razorpay_signature:{
      type:String,
    },
    address:{
      address:{
        type:String,
      },
      pincode:{
        type:Number,
      },
      city:{
        type:String,
      },
      state:{
        type:String,
      }
    },
    amount:{type:Number,require:true},
    isPaymentLegit:{
      type:Boolean,
      default:false,
    },
    shipment:{
      type:Number,
      default:2,
    }
    
  },
  { timestamps: true }
);
const OrderModel= model<OrderDocument>("Order", orderSchema);

export default OrderModel;
