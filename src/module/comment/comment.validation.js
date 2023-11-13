import Joi from "joi";
import { generalFields } from "../../MiddleWare/validation.js";

export const addcomment={
    body:Joi.object().required().keys({
        CommentBody:generalFields.name.required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        postID:generalFields.id.required()
    }),
    file:generalFields.file.optional()
}
export const UpdateComment={
    body:Joi.object().required().keys({
        CommentBody:generalFields.name.optional(),
        postID:generalFields.id.required(),
    }),
    file:generalFields.file.optional(),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        commentID:generalFields.id.required()
    })
}
export const DeleteComment={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({
        commentID:generalFields.id.required(),
        postID:generalFields.id.required()
    }),
    params:Joi.object().required().keys({}),
}
export const LikeComment={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        commentID:generalFields.id.required()

    }),
}
export const UNLIKEComment={
    body:Joi.object().required().keys({}),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({
        commentID:generalFields.id.required()
    }),
}


