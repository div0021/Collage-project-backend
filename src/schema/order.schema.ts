import { TypeOf, any, array, number, object, string } from "zod";

const payload = {
    body:object({
        products:array(object({
            data:any(),
            quantity:number().positive("quantity should be greater than 0"),
        })),
        amount:number().positive("amount should be greater than zero"),
        currency:string().min(1,"currency is required!"),
        receipt:string().min(1,"recipt is required!"),
        address:object({
            address:string().min(1,"address is required!"),
            pincode:number().positive("pincode must positive"),
            state:string().min(1,"state is required!"),
            city:string().min(1,"city is required!")
        }),
        shipment:number().positive("shipment must be a positive integer")
        
    })
}

export const updateOrderSchema =  object({
    ...payload,
})
export const createOrderSchema =  object({
    ...payload
})


export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>


export type CreateOrderInput = TypeOf<typeof createOrderSchema>