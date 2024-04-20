import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FavouriteModel, { FavouriteDocument } from "../models/favourite.model";

export async function findAndUpdateFavourite(query:FilterQuery<FavouriteDocument>,update:UpdateQuery<FavouriteDocument>,options:QueryOptions={}) {
    return await FavouriteModel.findOneAndUpdate(query,update,options);
    
}
export async function findFavourite(query:FilterQuery<FavouriteDocument>,options:QueryOptions={}) {
    return await FavouriteModel.findOne(query,options).populate('products').select('-user');
    
}
export async function findFavouriteIds(query:FilterQuery<FavouriteDocument>,options:QueryOptions={}) {
    return await FavouriteModel.findOne(query,options)
    
}