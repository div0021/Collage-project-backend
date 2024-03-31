import { TypeOf, number, object, string } from "zod";

const payload = {
    body:object({
        title:string().min(3,"Title is too short"),
        description:string().min(30,"description is too short"),
        price:number({required_error:"Price is required!"}),
        image:string({required_error:"Image is required!"}),    
    })
}
const params = {
    params:object({
        productId:string({
            required_error:"ProductId is required"
        })
    })
}

export const createProductSchema =  object({
    ...payload
})
export const updateProductSchema =  object({
    ...payload,
    ...params
})
export const deleteProductSchema =  object({
    ...params
})
export const getProductSchema =  object({
    ...params
})

export type CreateProductInput = TypeOf<typeof createProductSchema>

export type UpdateProductInput = TypeOf<typeof updateProductSchema>

export type DeleteProductInput = TypeOf<typeof deleteProductSchema>

export type GetProductInput = TypeOf<typeof getProductSchema>