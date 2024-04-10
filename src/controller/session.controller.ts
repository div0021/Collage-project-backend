import { CookieOptions, Request, Response } from "express";
import { findAndUpdateUser, getGoogleOAuthTokens, getGoogleUser, validatePassword } from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import log from "../utils/logger";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import { get, omit } from "lodash";


const accessTokenTtl = config.get<string>("accessTokenTtl");
const refreshTokenTtl = config.get<string>("refreshTokenTtl");
const domain = config.get<string>('domain')

const accessTokenCookieOptions:CookieOptions= {
  maxAge: 86400000, // 1 days
  httpOnly: true,
  domain: domain || "localhost", // change in production
  path: "/",
  sameSite: "none",
  secure: true,
}

const refreshTokenCookieOptions:CookieOptions = {
  ...accessTokenCookieOptions,
}

export async function createUserSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;


  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "email and password both are required!" });
  }

  try {
    // validate the user's password
    const user = await validatePassword({ email, password });

    if (!user) return res.status(401).send("Invalid email or password.");

    // create session

    const session = await createSession(user._id, req.get("user-agent") || "");

    const validUser = omit(user.toJSON(), ["password"]);

    // create access token

    const accessToken = signJwt(
      {
        ...validUser,
        session: session._id,
      },
      { expiresIn: accessTokenTtl }
    );

    // create refresh Token
    const refreshToken = signJwt(
      {
        ...validUser,
        session: session._id,
      },
      { expiresIn: refreshTokenTtl }
    );

    // storing access token and refresh in cookies

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    log.error("[CREATESESSION]:: " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  if (!userId) {
    return res.sendStatus(403);
  }

  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  console.log(sessionId);

  try {
    await updateSession({ _id: sessionId }, { valid: false });

    const cookies = req.cookies;

    if (
      get(cookies, "accessToken") &&
      String(get(cookies, "accessToken")).length > 0
    ) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }
    if (
      get(cookies, "refreshToken") &&
      String(get(cookies, "refreshToken")).length > 0
    ) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    log.error("[SESSIONDELETE]:: " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// google login
export async function googleOauthHandler(req:Request, res:Response) {
     // get the code from qs

     const code = req.query.code as string;

    // get the id and access token with the code

    try{

     const {id_token,access_token} = await getGoogleOAuthTokens({code})
    
     console.log({id_token,access_token})

     // get the user with the token

     const googleUser = await getGoogleUser({access_token,id_token})

     console.log({googleUser});

     if(!googleUser.verified_email){
      return res.status(403).send('Google account is not verified')
     }

     // upsert the user

     const user = await findAndUpdateUser({
       email:googleUser.email,
     },{
      email:googleUser.email,
      name:googleUser.name,
      image:googleUser.picture,
     },{upsert:true,new:true})

     // create session

     const session = await createSession(user?._id, req.get("user-agent") || "");

     const validUser = omit(user?.toJSON(), ["password"]);
 
     // create access token
 
     const accessToken = signJwt(
       {
         ...validUser,
         session: session._id,
       },
       { expiresIn: accessTokenTtl }
     );
 
     // create refresh Token
     const refreshToken = signJwt(
       {
         ...validUser,
         session: session._id,
       },
       { expiresIn: refreshTokenTtl }
     );

       // storing access token and refresh in cookies

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

     // redirect back to client

     return res.redirect(`${config.get("origin")}`)

    }catch(e){
      log.error(e,"Failed to authorize google user")
      return res.redirect(`${config.get("origin")}/oauth/error`)
    }

}