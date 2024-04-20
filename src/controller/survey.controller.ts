import { Request, Response } from "express";
import { CreateSurveyInput } from "../schema/survey.schema";
import log from "../utils/logger";
import { createProfile, updateUser } from "../service/user.service";
import { createPersonalSurvey } from "../service/survey.service";


export async function createSurveyHandler(req:Request<object,CreateSurveyInput["body"]>,res:Response) {

    const userId = res.locals.user._id;


    const {firstName,lastName,gender,age,contact,medication,supplements,kids,wood,sleep,pet,problem} = req.body;


    try{

        // create profile

        await createProfile({user:userId,firstName,lastName,gender,age,contact});

        // create survey

        await createPersonalSurvey({kids,medication,pet,problemCategories:problem,sleep,supplements,wood,user:userId})

        // update user

     const user =  await updateUser({_id:userId},{userSurvey:true},{new:true});

        return res.status(200).json({user});
    }catch(e){
        log.error("[CREATESURVEY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}