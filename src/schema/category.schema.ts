import { TypeOf, any, array, coerce, object, string } from "zod";

const payload = {
    body:object({
        name:string().min(3,"Title is too short"),
        description:string().min(10,"description is too short"),
        subCategories:array(string()),
        
    })
}
const params = {
    params:object({
        categoryId:string({
            required_error:"CateogyId is required"
        })
    })
}

// output schema

export const categoriesOutputSchema = object({
    _id:any(),
    name:string(),
    description:string(),
    subCategories:array(string()),
    createdAt:coerce.date(),
    updatedAt:coerce.date(),
})

export const createCategorySchema =  object({
    ...payload
})
export const updateCategorySchema =  object({
    ...payload,
    ...params
})
export const deleteCategorySchema =  object({
    ...params
})
export const getCategorySchema =  object({
    ...params
})
export const getProductByCategorySchema =  object({
    ...params
})

export type CreateCategoryInput = TypeOf<typeof createCategorySchema>

export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>

export type DeleteCategoryInput = TypeOf<typeof deleteCategorySchema>

export type GetCategoryInput = TypeOf<typeof getCategorySchema>
export type GetProductByCategoryInput = TypeOf<typeof getProductByCategorySchema>