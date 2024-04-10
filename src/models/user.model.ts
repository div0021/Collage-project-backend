import mongoose from "mongoose";
import bcrypt from "bcrypt"
import config from "config"
import log from "../utils/logger";

export enum  UserRoles {
    ADMIN = 'admin',
    USER = 'user'
}

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
        minLength:3
    },
    password:{
        type:String,
        required:true
    },
    image:{
      type:String,
    },
    role:{
      type: String,
      enum:['user','admin'],
      default:'user',
    },
    userSurvey:{
      type:Boolean,
      default:false,
    },
    isEmailVerified:{
      type: Boolean,
      default: false,
    }
},{timestamps:true})

export interface UserInput {
    email: string;
    name: string;
    password: string;
  }
  
  export interface UserDocument extends UserInput, mongoose.Document {
    role: UserRoles;
    isEmailVerified:boolean,
    userSurvey:boolean,
    image:string,
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }

  export interface HookNextFunction {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error?: Error): any;
  }

  userSchema.pre('save', async function (next:HookNextFunction) {
    const user = this as UserDocument;

    if (!user.isModified('password')) return next()

    const saltFactor = config.get<number>("saltWorkFactor");
    try{
        const salt = await bcrypt.genSalt(saltFactor);

        const hash = await bcrypt.hash(user.password, salt)

        user.password=hash;
        return next();
    } catch(error){
        log.error("Hashing Error:: "+ error)
        return next()
    }
  })

  userSchema.methods.comparePassword = async function(candidatePassword:string):Promise<boolean>{
    const user = this as UserDocument

    return  bcrypt.compare(candidatePassword,user.password).catch(()=>false)

  }

const UserModal = mongoose.model<UserDocument>("User",userSchema)

export default UserModal;