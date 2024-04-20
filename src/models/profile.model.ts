import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface ProfileInput {
  user: UserDocument["_id"];
  firstName: string;
  lastName: string;
  age:number;
  contact:number;
  gender:string;
  address?:string;
  city?:string;
  state?:string;
  pincode?:number;
}

export interface ProfileDocument extends ProfileInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

const profileSchema = new Schema(
  {
    user:{type:Schema.Types.ObjectId,ref:"User", required: true,unique:true },
    firstName: { type: String ,required :true},
    lastName: { type: String, required: true },
    gender:{type:String, enum: Object.values(Gender),required:true},
    age: { type: Number, required: true },
    contact:{type:Number,required:true},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    pincode: { type: Number },

  },
  { timestamps: true }
);
const ProfileModel = model<ProfileDocument>("Profile", profileSchema);

export default ProfileModel;
