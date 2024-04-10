import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verfiyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";
import log from "../utils/logger";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  
  if(req.url==='/api/sessions'){
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });    
  }

  const accessToken =
    get(req, "cookies.accessToken") 

  const refreshToken =
    get(req, "cookies.refreshToken") 

    log.info({url:req.url,method:req.method})

  if(!refreshToken){
    return next();
  }

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verfiyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }


  if (expired && accessToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });


    if (typeof newAccessToken === "boolean"){
      return res.status(403).json({ message: "Not generated token" });
}
    if (newAccessToken) {
      res.cookie("accessToken",newAccessToken,{
        maxAge:86400000,
        httpOnly:true,
        domain:'localhost',
        path:"/",
        sameSite:"strict",
        secure:false,
      })
    }

    const result = verfiyJwt(newAccessToken);

    res.locals.user = result.decoded;
    return next();
  }
  return next();
};
export default deserializeUser;
