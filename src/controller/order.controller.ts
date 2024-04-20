import { Request, Response } from "express";
import Razorpay from "razorpay";
import { CreateOrderInput } from "../schema/order.schema";
import log from "../utils/logger";
import { createOrder, findOrderByUser, updateOrder } from "../service/order.service";
import config from 'config'
import crypto from "crypto"
import { findAndUpdateProduct } from "../service/product.service";
import { findAndUpdateCart } from "../service/cart.service";

export async function createOrderHandler(req:Request<object,CreateOrderInput["body"]>,res:Response) {

    const userId = res.locals.user._id;

    const key_id= config.get<string>('razorpayKeyId')
    const key_secret = config.get<string>('razorpayKeySecret')

    if(!key_id || !key_secret){
        return res.sendStatus(500);
    }

    const razorpay = new Razorpay({
        key_id,
        key_secret,
    })

    const {amount,products,currency,receipt,shipment,address} = req.body;

    if(!amount || !products || !currency || !receipt || !shipment || !address) return res.sendStatus(404);

    try{

        const totalAmount = Math.round(amount/100)

        const order_id = await razorpay.orders.create({
            amount,currency,receipt
        });

        if(!order_id) return res.send(500).json({
            message:"order_id creation failed!",
        });

        await createOrder({amount:totalAmount,products,razorpay_order_id:order_id.id,shipment,user:userId,address:address});

        return res.status(200).json(order_id);

    }catch(error){
        log.error("CREATEORDERERROR");
        console.log("CREATEORDERERROR",error);
        return res.status(500).json({message:"Server internal error"});
    }
    
}

export  async function verifyPaymentHandler(req:Request,res:Response){

    const userId = res.locals.user._id;

    const key_secret = config.get<string>('razorpayKeySecret')
    const origin = config.get<string>('origin');

    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !key_secret ) return res.redirect(`${origin}/error?error=notfound`)

    const sha = crypto.createHmac("sha256",key_secret);

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if(digest!== razorpay_signature){

        return res.redirect(`${origin}/error?error=notvalidpayment`)
    }


    // Payment is valid

    const order = await updateOrder({razorpay_order_id},{isPaymentLegit:true,razorpay_payment_id,razorpay_signature},{new:true});

    const products = order?.products;


    try{

    products?.forEach(async (product)=>{

        const productId = product.data._id;
        const originalQuantity = product.data.quantity;
        const quantitySub = originalQuantity - product.quantity;

        if(quantitySub < 0) throw new Error('Out of quantity error');


        if(quantitySub>0){
         await findAndUpdateProduct({_id:productId},{quantity:quantitySub},{})
        }else if(quantitySub===0){
            await findAndUpdateProduct({_id:productId},{quantity:quantitySub,isArchived:true},{})
        }


         await findAndUpdateCart({user:userId},{
            $pull:{products:{data:productId}}
          },{})



    })

    return res.redirect(`${origin}/paymentsuccess?reference=${razorpay_payment_id}`);

}catch(error){
        log.error("CREATEORDERERROR");
        console.log("CREATEORDERERROR",error);
        return res.status(500).json({message:"Server internal error"});
}

}

export  async function razepayGetKeyHandler(req:Request,res:Response){

    const key_id= config.get<string>('razorpayKeyId')

    return res.status(200).json({key_id})

}

// get order

export async function getOrdersHandler(req:Request,res:Response){

    const userId = res.locals.user._id;

    try{

        const orders = await findOrderByUser({user:userId});

        if(orders.length === 0){
            return res.sendStatus(404);
        }

        return res.status(200).json({orders})

    }catch(error){
        log.error("GETORDER");
        console.log("GETORDER",error);
        return res.status(500).json({message:"Server internal error"});
    }



}