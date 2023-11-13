import Joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";

export const GetUserProfile={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const UpdateUserProfile={
    body:Joi.object().required().keys({
        username:generalFields.name.max(20).optional(),
        Email:generalFields.email.optional(),
        phone:Joi.string().max(11).optional(),
        age:Joi.number().positive().integer().min(10).optional(),
    }),
    file:generalFields.file.optional(),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const AddProfilePIC={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({}),
    file:generalFields.file.required()
}
export const AddCoverePIC={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({}),
    file:generalFields.file.required()
}


