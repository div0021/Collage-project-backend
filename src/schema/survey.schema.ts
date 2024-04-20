import { TypeOf, array, boolean, number, object, string } from "zod";

const payload = {
    body:object({

        firstName:string().min(2,"name is too short...").max(50,"name is too long..."),
        lastName:string().min(2,"name is too short...").max(50,"name is too long..."),
        age:number()
            .positive("age must be positive").int("age must be an integer"),
        contact:string().refine(value => /^\d{10}$/.test(value), {
            message: 'Input must be a 10-digit phone number',
          }),
        gender:string().refine(value => value === 'male' || value === 'female' || value === 'other', {
            message: 'Gender must be either "male" or "female"',
          }),
          medication:boolean({required_error:"Must include medication information"}),
          sleep:boolean({required_error:"Must include sleep information"}),
          pet:boolean({required_error:"Must include pet information"}),
          kids:boolean({required_error:"Must include kids information"}),
          supplements:boolean({required_error:"Must include supplements information"}),
          wood:boolean({required_error:"Must include wood information"}),
          problem:array(string()).min(1,"provide something(problem)")
        
    })
}

export const createSurveySchema =  object({
    ...payload,
})


export type CreateSurveyInput = TypeOf<typeof createSurveySchema>


