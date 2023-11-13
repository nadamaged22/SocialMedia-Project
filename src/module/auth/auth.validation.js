import Joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";

export const SignUp={
    body:Joi.object().required().keys({
        username:generalFields.name.max(20).required(),
        Email:generalFields.email.required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
        phone:Joi.string().max(11).required(),
        age:Joi.number().positive().integer().min(10),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const LogIn={
    body:Joi.object().required().keys({
        Email:generalFields.email.required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const confirmEmail={
    body:Joi.object().required().keys({
        Email:generalFields.email.required(),
        code:Joi.string().max(6).min(6).required()
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const sendCode={
    body:Joi.object().required().keys({
        Email:generalFields.email.required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const ResetPassword={
    body:Joi.object().required().keys({
        Email:generalFields.email.required(),
        code:Joi.string().max(6).min(6).required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}

