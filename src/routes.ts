import { Express } from "express";
import { createUserHandler, getCurrentUser, getProfileHandler, updateProfileHandler, verifyMailHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createUserSchema, updateProfileSchema } from "./schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, googleOauthHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";
import { createProductHandler, deleteProductHandler, getAllAdminProductHandler, getAllProductHandler, getProductByCategoryHandler, getProductHandler, getRecommandedProductHandler, updateProductHandler } from "./controller/product.controller";
import { resetPasswordEmailSchema, resetPasswordOTPSchema, resetPasswordSchema } from "./schema/resetpassword.schema";
import { resetPassword, resetPasswordEmail, resetPasswordMailVerification } from "./controller/forgetPassword.controller";
import requireEmail from "./middleware/requireEmail";
import requireAdminUser from "./middleware/requireAdminUser";
import { createCategorySchema, deleteCategorySchema, getCategorySchema, getProductByCategorySchema, updateCategorySchema } from "./schema/category.schema";
import { createCategoryHandler, deleteCategoryHandler, getAllCategoryHandler, getCategoryHandler, updateCategoryHandler } from "./controller/category.controller";
import { getCartHandler, updateCartHandler } from "./controller/cart.controller";
import { updateCartSchema } from "./schema/cart.schema";
import { updateFavouriteSchema } from "./schema/favourite.schema";
import { getFavouriteHandler, updateFavouriteHandler } from "./controller/favourite.controller";
import { createSurveySchema } from "./schema/survey.schema";
import { createSurveyHandler } from "./controller/survey.controller";
import { createOrderSchema } from "./schema/order.schema";
import { createOrderHandler, getOrdersHandler, razepayGetKeyHandler, verifyPaymentHandler } from "./controller/order.controller";
export default function routes(app:Express){

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


    app.get("/api/products/category/:categoryId",validate(getProductByCategorySchema),getProductByCategoryHandler);


    // cart

    // normal user

    app.put("/api/cart",[requireUser,validate(updateCartSchema)],updateCartHandler)
    app.get("/api/cart",requireUser,getCartHandler)

    // favourite

    app.put("/api/favourite",[requireUser,validate(updateFavouriteSchema)],updateFavouriteHandler);

    app.get("/api/favourite",requireUser,getFavouriteHandler)

    // survey

    //create

    app.post("/api/survey",[requireUser,validate(createSurveySchema)],createSurveyHandler);

    // get

    app.get("/api/survey",requireUser,getRecommandedProductHandler)

    // get User Profile

    app.get("/api/profile",requireUser,getProfileHandler)

    app.put("/api/profile", [requireUser,validate(updateProfileSchema)] , updateProfileHandler);

    // order 
    app.post("/api/order",[requireUser,validate(createOrderSchema)],createOrderHandler);
    app.get("/api/order",requireUser,getOrdersHandler);

    // get razer pay key id

    app.get("/api/getKey",requireUser,razepayGetKeyHandler);

    // open url

    app.post("/api/paymentVerification",verifyPaymentHandler);

    // verify mail

    app.get("/api/verifymail",verifyMailHandler);

}