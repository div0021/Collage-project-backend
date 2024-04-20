import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface PersonalSurveyInput {
  user: UserDocument["_id"];
  problemCategories:string[];
  medication:boolean;
  sleep:boolean;
  kids:boolean;
  pet:boolean;
  wood:boolean;
  supplements:boolean;
}

export interface PersonalSurveyDocument extends PersonalSurveyInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const personalSurveySchema = new Schema(
  {
    user:{type:Schema.Types.ObjectId,ref:"User", required: true,unique:true },
    problemCategories:[{type:String}],
    medication:{type:Boolean, default:false},
    sleep:{type:Boolean, default:false},
    pet:{type:Boolean, default:false},
    supplement:{type:Boolean, default:true},
    wood:{type:Boolean, default:false},
    kids:{type:Boolean, default:false},
  },
  { timestamps: true }
);
const PersonalSurveyModel = model<PersonalSurveyDocument>("PersonalSurvey", personalSurveySchema);

export default PersonalSurveyModel;
