import { Request, Response } from "express";
import { UpdateCartInput } from "../schema/cart.schema";
import { findAndUpdateCart, findCart } from "../service/cart.service";
import { ProductDocument } from "../models/product.model";
import log from "../utils/logger";


export async function updateCartHandler(req:Request<object,UpdateCartInput["body"]>,res:Response) {

    const userId = res.locals.user._id;


    const {productId,action,quantity} = req.body;

    try{
        const cartData = await findCart({user:userId});
        let productsInCart:(ProductDocument["_id"] & {quantity:boolean})[] = []

        if(action){
            if(cartData){
                productsInCart=cartData.products.filter(el=>String(el.data._id)!==productId);
            }
            productsInCart.push({data:productId,quantity})
        }else if(!action){
            if(cartData){
            productsInCart = cartData?.products.filter((item)=> String(item.data._id) !== productId)}
        }

        console.log("Products in Cart",productsInCart);

         await findAndUpdateCart({user:userId},{products:productsInCart},{new:true,upsert:true});

        return res.sendStatus(200);
    }catch(e){
        log.error("[UPDATECART]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}
export async function getCartHandler(req:Request,res:Response) {

    const userId = res.locals.user._id;

    try{
        const cartData = await findCart({user:userId});
        
        if(!cartData){
            return res.sendStatus(404);
        }
        return res.status(200).json({cartData})
    }catch(e){
        log.error("[GETCARTDATA]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}