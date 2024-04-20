import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CartModel, { CartDocument } from "../models/cart.model";

export async function findAndUpdateCart(query:FilterQuery<CartDocument>,update:UpdateQuery<CartDocument>,options:QueryOptions={}) {
    return await CartModel.findOneAndUpdate(query,update,options);
    
}
export async function findCart(query:FilterQuery<CartDocument>,options:QueryOptions={}) {
    return await CartModel.findOne(query,options).populate('products.data').select('-user');
    
}