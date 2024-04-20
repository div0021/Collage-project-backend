import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import OrderModel, { OrderDocument, OrderInput } from "../models/order.model";

export async function createOrder(input:OrderInput){
    return await OrderModel.create(input);

}
export async function updateOrder(query:FilterQuery<OrderDocument>,update:UpdateQuery<OrderDocument>,options:QueryOptions){
     return await OrderModel.findOneAndUpdate(query,update,options).populate('products.data');

}

export async function findOrder(query:FilterQuery<OrderDocument>,options:QueryOptions){
     return await OrderModel.findOne(query,{},options);

}
export async function findOrderByUser(query:FilterQuery<OrderDocument>,options:QueryOptions = {lean:true}){
     return await OrderModel.find(query,{},options).populate({path:'products.data',select:"-user"}).select(" -user -razorpay_signature");

}