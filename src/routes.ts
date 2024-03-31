import { Express, Request, Response } from "express";
import { createUserHandler, getCurrentUser } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, googleOauthHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { resetPasswordEmailSchema, resetPasswordOTPSchema, resetPasswordSchema } from "./schema/resetpassword.schema";
import { resetPassword, resetPasswordEmail, resetPasswordMailVerification } from "./controller/forgetPassword.controller";
import requireEmail from "./middleware/requireEmail";
export default function routes(app:Express){

    app.get("/healthcheck",(req:Request,res:Response)=>{
        res.sendStatus(200)

    });
    // create a new user
    app.post("/api/users",validate(createUserSchema),createUserHandler);

    // reset password
    app.post("/api/reset",validate(resetPasswordEmailSchema),resetPasswordEmail)
    app.post("/api/reset/:token",validate(resetPasswordOTPSchema),resetPasswordMailVerification);
    app.patch("/api/reset",[requireEmail,validate(resetPasswordSchema)],resetPassword);


    // get user profile
    app.get("/api/me",requireUser,getCurrentUser)


    // login with email and password
    app.post("/api/sessions",validate(createSessionSchema),createUserSessionHandler)

    app.get("/api/sessions",requireUser,getUserSessionsHandler)

    app.delete("/api/sessions",requireUser,deleteSessionHandler)


    // Google login
    app.get("/api/sessions/oauth/google",googleOauthHandler)


    // product 
    
    app.post("/api/products",[requireUser,validate(createProductSchema)],createProductHandler);

    app.put("/api/products/:productId",[requireUser,validate(updateProductSchema)],updateProductHandler);


    app.get("/api/products/:productId",validate(getProductSchema),getProductHandler);

    app.delete("/api/products/:productId",[requireUser,validate(deleteProductSchema)],deleteProductHandler);

}