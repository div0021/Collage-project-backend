import { Request, Response } from "express";
import log from "../utils/logger";
import { CreateCategoryInput, DeleteCategoryInput, GetCategoryInput, UpdateCategoryInput, categoriesOutputSchema } from "../schema/category.schema";
import { createCategory, deleteCategory, findAllCategory, findAndUpdateCategory, findCategory } from "../service/category.service";
import * as z from "zod"

export async function createCategoryHandler(req:Request<object,object,CreateCategoryInput["body"]>,res:Response) {

    const userId = res.locals.user._id;

    const body = req.body;
    
    try{

     await createCategory({...body,user:userId})
    
    return res.sendStatus(200);

    }catch(e){
        log.error("[CREATECATEGORY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
}


export async function updateCategoryHandler(req:Request<UpdateCategoryInput["params"]>,res:Response) {

    const userId = res.locals.user._id;

    const categoryId = req.params.categoryId;

    const update = req.body;

    try{
        const category = await findCategory({_id:categoryId})

        if(!category){
            return res.sendStatus(404)
        }

        if(String(category.user) !== userId){
            return res.sendStatus(403);
        }

         await findAndUpdateCategory({_id:categoryId},update,{new:true});

        return res.sendStatus(200);
    }catch(e){
        log.error("[UPDATECATEGORY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}


export async function getCategoryHandler(req:Request<GetCategoryInput["params"]>,res:Response) {


    const categoryId = req.params.categoryId;

    try{
        const category = await findCategory({_id:categoryId})

        if(!category){
            return res.sendStatus(404)
        }

        const abstractedCategory = categoriesOutputSchema.parse(category);


        return res.json({category:abstractedCategory});
    }catch(e){
        log.error("[GETCATEGORY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}

export async function getAllCategoryHandler(req:Request,res:Response) {

    try{
        const categories = await findAllCategory({})

        if(!categories || categories.length === 0){
            return res.sendStatus(404)
        }

        const abstractedCategories = z.array(categoriesOutputSchema).parse(categories);


        return res.json({categories:abstractedCategories});
    }catch(e){
        log.error("[GETALLCATEGORY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}


export async function deleteCategoryHandler(req:Request<DeleteCategoryInput["params"]>,res:Response) {

    const userId = res.locals.user._id;

    const categoryId = req.params.categoryId;

    console.log("in delete")


    try{
        const category = await findCategory({_id:categoryId});

        if(!category){
            return res.sendStatus(404)
        }

        if(String(category.user) !== userId){
            return res.sendStatus(403);
        }

         await deleteCategory({_id:categoryId});

        return res.json({message:"Category remove successfully!"});
    }catch(e){
        log.error("[DELETECATEGORY]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}