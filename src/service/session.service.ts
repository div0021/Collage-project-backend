import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verfiyJwt } from "../utils/jwt.utils";
import { get, omit } from "lodash";
import { findUser } from "./user.service";
import config from "config"

export async function createSession(userId:string,userAgent:string){
    const session = await SessionModel.create({user:userId,userAgent})

    return session.toJSON();
}

export async function findSessions(query:FilterQuery<SessionDocument>){
    return SessionModel.find(query).lean()
}

export async function updateSession(query:FilterQuery<SessionDocument>,update:UpdateQuery<SessionDocument>) {
    return SessionModel.updateOne(query,update);
}

export async function reIssueAccessToken({refreshToken}:{refreshToken:string}){
    const {decoded} = verfiyJwt(refreshToken);


    if(!decoded || !get(decoded,"session")) return false;


    const session = await SessionModel.findById(get(decoded,"session"))

    if(!session || !session.valid){
        return false;
    }

    const user = await findUser({_id:session.user})

    if(!user) return false;

    const validUser=omit(user,"password");

    const accessToken = signJwt({...validUser,session:session._id},{expiresIn:config.get("accessTokenTtl")});

    return accessToken;

}