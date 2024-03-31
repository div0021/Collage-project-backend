import { omit } from "lodash";
import UserModal, { UserDocument, UserInput } from "../models/user.model";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import config from "config"
import axios from "axios";
import qs from "qs"
import log from "../utils/logger";
import { AxiosError } from "axios";

export async function createUser(input:UserInput){
    try{
        console.log("In services")
        const user = await UserModal.create(input)

        const result = omit(user.toJSON(),"password")
        console.log(result)

        return result;

    }catch(e){
        throw new Error(String(e))

    }
}

// validate password 
export async function validatePassword({email,password}:{email:string,password:string}){

    const user = await UserModal.findOne({email});

    if(!user){
        return false;
    }

    const isValid = await user.comparePassword(password)

    if(!isValid){
        return false;
    } 
    return user;

}

export async function findUser(query:FilterQuery<UserDocument>) {

    return await UserModal.findOne(query).lean();
    
}

export async function findAndUpdateUser(query:FilterQuery<UserDocument>,update:UpdateQuery<UserDocument>,options:QueryOptions={}) {
    return await UserModal.findOneAndUpdate(query,update,options);
    
}


interface GoogleTokensResult {
    access_token : string ,
    refresh_token : string ,
    expires_in   : number,
    scope:string,
    id_token:string,
}

export async function getGoogleOAuthTokens({code}:{code:string}):Promise<GoogleTokensResult> {

    const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id:config.get<string>('googleClientId'),
        client_secret:config.get<string>('googleClientSecret'),
        redirect_uri:config.get<string>('googleOAuthRedirectURL'),
        grant_type:"authorization_code",

    };

    // console.log({values})

    try{

        const res = await axios.post<GoogleTokensResult>(url,qs.stringify(values),{
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },withCredentials:true,
        });

        return res.data;

    }catch(error){
        log.error(error, "Failed to fetch Google Oauth Tokens");
        if(error instanceof AxiosError){
            console.error(error)
            throw new Error(error.message)
        }else{
        console.error(error);
    throw new Error(String(error));
    }

    }

}

interface GoogleUserResult{
    id:string;
    email:string;
    verified_email:boolean;
    name:string;
    given_name:string;
    family_name:string;
    picture:string;
    locale:string;
}

export async function getGoogleUser({id_token,access_token}:{id_token:string;access_token:string}):Promise<GoogleUserResult>{
    try{

        const res = await axios.get<GoogleUserResult>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
            headers:{
                Authorization:`Bearer ${id_token}`
            }
        });

        return res.data;

    }catch(error){
        log.error(error, "Error Fetching google user");
        if(error instanceof AxiosError){
            console.error(error)
            throw new Error(error.message)
        }else{
        console.error(error);
    throw new Error(String(error));
    }
        

    }
}