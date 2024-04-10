import { Request, Response } from "express";
import logger from "../utils/logger"
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export async function createUserHandler(req:Request<object,object,CreateUserInput['body']>,res:Response){

    try{
        const user = await createUser(req.body);
        console.log("in controller")
        return res.status(200).json(user);
    }catch(e){
        logger.error("[CREATEUSER]:: " + e);
        if(e instanceof Error){
        return res.status(409).json(e.message)
    }else{
        return res.sendStatus(409);
    }
    }

}

export async function getCurrentUser(req:Request,res:Response){
    console.log('request', res.locals.user);
    return res.send(omit(res.locals.user,"session"))
}
