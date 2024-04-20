import { TypeOf, boolean, object, string } from "zod";

const payload = {
    body:object({
        productId:string().min(3,"id is too short"),
        action:boolean().default(true)
        
    })
}

export const updateFavouriteSchema =  object({
    ...payload,
})
export const getFavouriteSchema =  object({
    ...payload
})


export type UpdateFavouriteInput = TypeOf<typeof updateFavouriteSchema>


export type GetFavouriteInput = TypeOf<typeof getFavouriteSchema>