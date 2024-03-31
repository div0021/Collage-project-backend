import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument, ProductInput } from "../models/product.model";

export async function createProduct(input:ProductInput){
    return await ProductModel.create(input)
}

export async function findProduct(query:FilterQuery<ProductDocument>,options:QueryOptions = {lean:true}) {
    return await ProductModel.findOne(query,{},options);
}

export async function findAndUpdateProduct(query:FilterQuery<ProductDocument>,update:UpdateQuery<ProductDocument>,options:QueryOptions) {
    return await ProductModel.findOneAndUpdate(query,update,options);
    
}

export async function deleteProduct(query:FilterQuery<ProductDocument>) {
    return await ProductModel.deleteOne(query)
    
}