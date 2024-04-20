import { FilterQuery, QueryOptions } from "mongoose";
import PersonalSurveyModel, { PersonalSurveyDocument, PersonalSurveyInput } from "../models/personalsurvey.model";


export async function createPersonalSurvey(input:PersonalSurveyInput){

    return await PersonalSurveyModel.create(input)

}

export async function getPersonalSurvey(query:FilterQuery<PersonalSurveyDocument> ,options:QueryOptions){

    return await PersonalSurveyModel.findOne(query,{}, options)

}

