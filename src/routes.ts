import { Express, Request, Response } from "express";
import { createUserHandler, getCurrentUser } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, googleOauthHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";
import { createProductHandler, deleteProductHandler, getAllAdminProductHandler, getAllProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { resetPasswordEmailSchema, resetPasswordOTPSchema, resetPasswordSchema } from "./schema/resetpassword.schema";
import { resetPassword, resetPasswordEmail, resetPasswordMailVerification } from "./controller/forgetPassword.controller";
import requireEmail from "./middleware/requireEmail";
import requireAdminUser from "./middleware/requireAdminUser";
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from "./schema/category.schema";
import { createCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler } from "./controller/category.controller";
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


    // Category

    // admin routes
    // Create
    app.post("/api/admin/category/create",[requireAdminUser,validate(createCategorySchema)],createCategoryHandler);

    // update 
    app.put("/api/admin/category/:categoryId",[requireAdminUser,validate(updateCategorySchema)],updateCategoryHandler);

    // delete
    app.delete("/api/admin/category/:categoryId",[requireAdminUser,validate(deleteCategorySchema)],deleteCategoryHandler);

    
    // Normal routes
    // get by id
    app.get("/api/category/:categoryId",validate(getCategorySchema),getCategoryHandler);

    // get All
    app.get("/api/allCategories",getAllCategoryHandler);


    // product 
    // admin routes
    //create
    app.post("/api/admin/product",[requireAdminUser,validate(createProductSchema)],createProductHandler);

    // update
    app.put("/api/admin/product/:productId",[requireAdminUser,validate(updateProductSchema)],updateProductHandler);

    // delete
    app.delete("/api/admin/product/:productId",[requireAdminUser,validate(deleteProductSchema)],deleteProductHandler);

    // all product for admin
    app.get("/api/admin/products",requireAdminUser,getAllAdminProductHandler);


    // Normal access
    app.get("/api/product/:productId",validate(getProductSchema),getProductHandler);

    app.get("/api/products",getAllProductHandler);



}