import { Request, Response } from "express";
import { ProductDocument } from "../models/product.model";
import log from "../utils/logger";
import { UpdateFavouriteInput } from "../schema/favourite.schema";
import { findAndUpdateFavourite, findFavourite, findFavouriteIds } from "../service/favourite.service";


export async function updateFavouriteHandler(req:Request<object,UpdateFavouriteInput["body"]>,res:Response) {

    const userId = res.locals.user._id;


    const {productId,action} = req.body;

    try{
        const favouriteData = await findFavouriteIds({user:userId});

        let productInFavourite:ProductDocument["_id"][] = favouriteData?.products || []


        if(action){
            if(favouriteData){
                productInFavourite=favouriteData.products.filter(el=>String(el._id)!==productId);
            }
            productInFavourite.push(productId)
        }else if(!action){
            productInFavourite = productInFavourite.filter((item)=> String(item) !== productId);
        }

         await findAndUpdateFavourite({user:userId},{products:productInFavourite},{new:true,upsert:true});

        return res.sendStatus(200);
    }catch(e){
        log.error("[UPDATEFavourite]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}
export async function getFavouriteHandler(req:Request,res:Response) {

    const userId = res.locals.user._id;

    try{
        const favouriteData = await findFavourite({user:userId});
        
        if(!favouriteData){
            return res.sendStatus(404);
        }
        return res.status(200).json({favouriteData})
    }catch(e){
        log.error("[GETFAVOURITEDATA]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}