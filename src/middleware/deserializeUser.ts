import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verfiyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") 

  const refreshToken =
    get(req, "cookies.refreshToken") 

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

    if (typeof newAccessToken === "boolean")
      return res.status(403).json({ message: "Not generated token" });

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
