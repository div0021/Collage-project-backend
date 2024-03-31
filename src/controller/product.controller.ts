import { Request, Response } from "express";
import { CreateProductInput, DeleteProductInput, GetProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from "../service/product.service";
import log from "../utils/logger";

export async function createProductHandler(req:Request<object,object,CreateProductInput["body"]>,res:Response) {
    const userId = res.locals.user._id;

    const body = req.body;
    
    try{

    const product = await createProduct({...body,user:userId})
    
    return res.status(200).json(product)

    }catch(e){
        log.error("[CREATEPRODUCT]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
}


export async function updateProductHandler(req:Request<UpdateProductInput["params"]>,res:Response) {

    const userId = res.locals.user._id;

    const productId = req.params.productId;

    const update = req.body;

    try{
        const product = await findProduct({_id:productId})

        if(!product){
            return res.sendStatus(404)
        }

        if(String(product.user) !== userId){
            return res.sendStatus(403);
        }

        const updatedProduct = await findAndUpdateProduct({_id:productId},update,{new:true});

        return res.json(updatedProduct);
    }catch(e){
        log.error("[UPDATEDPRODUCT]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}


export async function getProductHandler(req:Request<GetProductInput["params"]>,res:Response) {


    const productId = req.params.productId;

    try{
        const product = await findProduct({_id:productId})

        if(!product){
            return res.sendStatus(404)
        }


        return res.json(product);
    }catch(e){
        log.error("[GETPRODUCT]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}


export async function deleteProductHandler(req:Request<DeleteProductInput["params"]>,res:Response) {

    const userId = res.locals.user._id;

    const productId = req.params.productId;


    try{
        const product = await findProduct({_id:productId})

        if(!product){
            return res.sendStatus(404)
        }

        if(String(product.user) !== userId){
            return res.sendStatus(403);
        }

         await deleteProduct({_id:productId});

        return res.json({message:"Product remove successfully!"});
    }catch(e){
        log.error("[DELETEPRODUCT]:: " + e);
        return res.status(500).json({message:"Internal error"})
    }
    
}