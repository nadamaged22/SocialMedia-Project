import { nanoid } from "nanoid";
import CommentModel from "../../../../DB/model/comment.model.js";
import PostModel from "../../../../DB/model/post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Jwt from "jsonwebtoken";

export const addcomment=asyncHandler(async(req,res,next)=>{ //user can comment with photo or image or both of them
    let{CommentBody}=req.body
    const{postID}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const customID=nanoid()
    req.body.createdBy=req.user._id
    req.body.postID=postID
    req.body.customID=customID
    const postExist=await PostModel.findById(postID)
    if(!postExist){
        return next (new Error("IN_VALID POST!",{cause:404}))
    }
    if(req.body.CommentBody){
        CommentBody=req.body.CommentBody
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/${customID}`})
        req.body.image={secure_url,public_id}
    }
    postExist.comments.push(decode.id)
    await postExist.save()
    const comment =await CommentModel.create(req.body)
    res.status(201).json({message:"COMMENT ADDED SUCCESSFULLY!",comment})
})
export const UpdateComment=asyncHandler(async(req,res,next)=>{//check first if the post still exist or not then check the existance of comment if both exist you can edit
    const{commentID}=req.params
    const{postID}=req.body
    const customID=nanoid()
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const postExist=await PostModel.findById(postID)
    if(!postExist){
        return next (new Error("IN_VALID POST!",{cause:404}))
    }
    const comment=await CommentModel.findById(commentID)
    if(!comment){
        return next (new Error("COMMENT IS NOT EXIST!",{cause:400}))
    }
    if((comment.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    if(req.body.CommentBody){
        comment.CommentBody=req.body.CommentBody
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/${comment.customID}`})
        const image=await CommentModel.findByIdAndUpdate(commentID,
            {image:{secure_url,public_id}},{new:false})
            await cloudinary.uploader.destroy(image.image.public_id)
    }
    await comment.save()
    res.status(200).json({message:'UPDATE SUCCESSFULLY!',comment})
   
})
export const DeleteComment=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.query
    const{postID}=req.query
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const postExist=await PostModel.findById(postID)
    if(!postExist){
        return next (new Error("IN_VALID POST!",{cause:404}))
    }
    const comment=await CommentModel.findByIdAndDelete(commentID)
    if(!comment){
        return next (new Error("COMMENT IS NOT EXIST!",{cause:400}))
    }
    if((comment.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/${comment.customID}`
    )
        //delete the folder its self
    await cloudinary.api.delete_folder(
        `Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/${comment.customID}`
    )
    res.status(200).json({message:"DELETED SUCCESS!",DeletedComment:comment})
})
export const LikeComment=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const commentExist=await CommentModel.findById(commentID)
    if(!commentExist){
        return next(new Error("IN_VALID COMMENT!",{cause:404}))
    }
    if(commentExist.Likes.includes(decode.id)){
        return next (new Error("YOU ALRAEDY LIKED THIS COMMENT!",{cause:409}))
    }
    commentExist.Likes.push(decode.id)
    await commentExist.save()
    res.status(201).json({message:"COMMENT LIKED SUCCESSFULLY!",commentExist})

})
export const UnLikeComment=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const commentExist=await CommentModel.findById(commentID)
    if(!commentExist){
        return next(new Error("IN_VALID COMMENT!",{cause:404}))
    }
    if(!commentExist.Likes.includes(decode.id)){
        return next (new Error("YOU ALRAEDY UNLIKED THIS COMMENT!",{cause:409}))
    }
    //remove the like
    commentExist.Likes.pull(decode.id)
    //save this change
    await commentExist.save()
    res.status(201).json({message:"YOU UNLIKE THIS COMMENT!",commentExist})
})