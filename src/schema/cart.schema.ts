import { TypeOf, boolean, number, object, string } from "zod";

const payload = {
    body:object({
        productId:string().min(3,"id is too short"),
        quantity:number().min(1,"quantity is needed"),
        action:boolean().default(true)
        
    })
}

export const updateCartSchema =  object({
    ...payload,
})
export const getCartSchema =  object({
    ...payload
})


export type UpdateCartInput = TypeOf<typeof updateCartSchema>


export type GetCartInput = TypeOf<typeof getCartSchema>