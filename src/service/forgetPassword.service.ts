// reset password 

import { FilterQuery } from "mongoose";
import { ResetPasswordEmailType } from "../schema/resetpassword.schema";
import UserModal from "../models/user.model";
import ForgetPasswordModal, { ForgetPasswordInput } from "../models/forgetpassword.model";

export async function findResetPasswordEmail(query:FilterQuery<ResetPasswordEmailType["body"]>){
    return await UserModal.find(query).lean().select('-password')

}

export async function createForgetSession(input:ForgetPasswordInput){
    return await ForgetPasswordModal.create(input)
}

export async function findForgetSession(query:FilterQuery<{token?:string,email?:string}>){
    return await ForgetPasswordModal.find(query);
}

export async function deleteForgetSession(query:FilterQuery<{token?:string,email?:string}>) {
    return await ForgetPasswordModal.findOneAndDelete(query);
    
}