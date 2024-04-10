import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument, CategoryInput } from "../models/category.model";

export async function createCategory(input:CategoryInput){
    return await CategoryModel.create(input)
}

export async function findCategory(query:FilterQuery<CategoryDocument>,options:QueryOptions = {lean:true}) {
    return await CategoryModel.findOne(query,{},options);
}

export async function findAllCategory(options:QueryOptions = {lean:true}) {
    return await CategoryModel.find({},{},options);
}

export async function findAndUpdateCategory(query:FilterQuery<CategoryDocument>,update:UpdateQuery<CategoryDocument>,options:QueryOptions) {
    return await CategoryModel.findOneAndUpdate(query,update,options);
    
}

export async function deleteCategory(query:FilterQuery<CategoryDocument>) {
    return await CategoryModel.deleteOne(query)
    
}