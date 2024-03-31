import mongoose from "mongoose";
import bcrypt from "bcrypt"
import config from "config"
import log from "../utils/logger";

const forgetpasswordSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    token:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        length:6  
    },
},{timestamps:true})

export interface ForgetPasswordInput {
    email: string;
    token: string;
    otp: string;
  }
  
  export interface ForgetPasswordDocument extends ForgetPasswordInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
  }

  export interface HookNextFunction {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error?: Error): any;
  }

  forgetpasswordSchema.pre('save', async function (next:HookNextFunction) {
    const forgetPassword = this as ForgetPasswordDocument;

    if (!forgetPassword.isModified('token')) return next()

    const saltFactor = config.get<number>("saltWorkFactor");
    try{
        const salt = await bcrypt.genSalt(saltFactor);

        const hash = await bcrypt.hash(forgetPassword.otp, salt)

        forgetPassword.otp=hash;
        return next();
    } catch(error){
        log.error("Hashing Error:: "+ error)
        return next()
    }
  })


const ForgetPasswordModal = mongoose.model<ForgetPasswordDocument>("ForgetPassword",forgetpasswordSchema)

export default ForgetPasswordModal;