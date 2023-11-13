import Joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";

export const addpost={
    body:Joi.object().required().keys({
        content:generalFields.name.required(),
        privacy:generalFields.name
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({}),
    file:generalFields.file.optional()
}
export const updatepost={
    body:Joi.object().required().keys({
        content:generalFields.name.optional(),
        privacy:generalFields.name.optional(),
    }),
    file:generalFields.file.optional(),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        id:generalFields.id.required()
    })
}
export const DeletePost={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({
    }),
    params:Joi.object().required().keys({
        id:generalFields.id.required()
    }),
}
export const GetPostByID={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({
    }),
    params:Joi.object().required().keys({
        id:generalFields.id.required()
    }),
}
export const GetPosts={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({
        size:Joi.number().positive().integer().optional(),
        page:Joi.number().positive().integer().optional(),
        sort:Joi.string()
    }),
    params:Joi.object().required().keys({}),
}
export const GetPostsCreatedToday={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({
    }),
    params:Joi.object().required().keys({}),
}
export const GetPostsCreatedYesterday={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({}),
}

export const LikePost={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        postID:generalFields.id.required()

    }),
}
export const UnLikePost={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        postID:generalFields.id.required()
    }),
}



