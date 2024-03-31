import {object,string} from "zod";

export const createSessionSchema = object({
    body:object({
        email:string({
            required_error: 'Email is required',
        }).email('Please enter a valid email address'),
        password: string().min(6,'Password must be at least 6 characters').max(50),
    })
})