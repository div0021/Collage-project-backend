import { TypeOf, array, boolean, number, object, string } from "zod";

const payload = {
    body:object({
        name:string().min(3,"Title is too short"),
        description:string().min(30,"description is too short"),
        brand:string().min(3,"brand name is too short"),
        price:number({required_error:"Price is required!"}).nonnegative("Number should be greater than zero"),
        images:array(string()).length(4,"Four images required for the product."),    
        category:string({required_error:"Category is required!"}),    
        discount:number().min(1,"This is too low!"),
        subCategories:array(string()).min(1,"provide subcategories."),
        quantity:number().nonnegative("Stock should be positive"),
        isFeatured:boolean().default(false),
        isArchived:boolean().default(false),
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