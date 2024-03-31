import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const requireEmail = (req:Request,res:Response,next:NextFunction) => {

    const email = get(req, "cookies.usermail");

    if(!email){
        return res.sendStatus(403)
    }
    res.locals.email = email;
    return next()


}

export default requireEmail;