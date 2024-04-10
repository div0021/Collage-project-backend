import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../models/user.model";

const requireAdminUser = (req:Request,res:Response,next:NextFunction) => {

    const user = res.locals.user;

    console.log("user",user);


    if(!user || user.role!== UserRoles.ADMIN){
        return res.sendStatus(403)
    }
    return next()


}

export default requireAdminUser;