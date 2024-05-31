import { Request, Response } from "express";
import logger from "../utils/logger"
import { createUser, findAndUpdateUser, findUser, getProfile, updateProfile } from "../service/user.service";
import { CreateUserInput, UpdateProfileInput } from "../schema/user.schema";
import log from "../utils/logger";
import { verfiyJwt } from "../utils/jwt.utils";
import config from "config"

export async function createUserHandler(req:Request<object,object,CreateUserInput['body']>,res:Response){

    try{
         await createUser(req.body);
        return res.status(200).json({message:"user created success fully"});
    }catch(e){
        logger.error("[CREATEUSER]:: " + e);
        if(e instanceof Error){
        return res.status(500).json(e.message)
    }else{
        return res.sendStatus(500);
    }
    }

}

export async function getCurrentUser(req:Request,res:Response){
    const userId = res.locals.user._id;

    try{

    const user = await findUser({_id:userId});

    if(!user) return res.status(404).json({message:"user not found!"})
    return res.send(user);

}catch(e){
    log.error("Get User Error",e);
    return res.status(500).json({message:"Internal Error"});
}
}


export async function getProfileHandler(req:Request,res:Response){

    const userId = res.locals.user._id;

    try{

    const profile = await getProfile({user:userId});

    if(!profile){
        return res.sendStatus(404);
    }


    return res.status(200).json({profile});

}catch(e){
    logger.error("[GETPROFILEERROR]:: " + e);
        if(e instanceof Error){
        return res.status(500).json(e.message)
    }else{
        return res.sendStatus(500);
    }

}
}

export async function updateProfileHandler(req:Request<object,UpdateProfileInput["body"]>,res:Response) {

    const userId = res.locals.user._id;

    const {address,pincode,state,city} = req.body

    try{

        const profile = await getProfile({user:userId});

        if(!profile){
            return res.sendStatus(404);
        }

        await updateProfile({user:userId},{pincode,address,state,city},{new:true});

        return res.sendStatus(204);
    }catch(e){
        logger.error("[UpdatePROFILEERROR]:: " + e);
        if(e instanceof Error){
        return res.status(500).json(e.message)
    }else{
        return res.sendStatus(500);
    }
    }
    
}

// verify email

export async function verifyMailHandler(req:Request,res:Response){

    const {token} = req.query;

    const origin = config.get<string>('origin');
    
    if(!token){
        return res.sendStatus(404);
    }

    try{

    // decode token
    const { decoded, expired } = verfiyJwt(token as string);

    if(expired){
       return res.sendStatus(403);
    }


    if (decoded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user:any = decoded;

      const validUser =await findUser({_id:user._id})

      if(!validUser) return res.sendStatus(404);

      await findAndUpdateUser({_id:validUser._id},{isEmailVerified:true});

      return res.redirect(`${origin}`);

      
    }
  

    return res.sendStatus(404);

}catch(e){
        logger.error("[UpdatePROFILEERROR]:: " + e);
        if(e instanceof Error){
        return res.status(500).json(e.message)
    }else{
        return res.sendStatus(500);
    }
    }
}