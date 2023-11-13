import { nanoid } from "nanoid"
import { asyncHandler } from "../../../utils/errorHandling.js"
import Jwt from "jsonwebtoken";
import CommentModel from "../../../../DB/model/comment.model.js";
import ReplyModel from "../../../../DB/model/reply.model.js";
import PostModel from "../../../../DB/model/post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
export const addreply=asyncHandler(async(req,res,next)=>{ //user can comment with photo or image or both of them
    let{ReplyBody}=req.body
    const{postID}=req.body
    const{CommentID}=req.body
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const customID=nanoid()
    req.body.createdBy=req.user._id
    req.body.postID=postID
    req.body.CommentID=CommentID
    req.body.customID=customID
    const postExist=await PostModel.findById(postID)
    if(!postExist){
        return next (new Error("IN_VALID POST!",{cause:404}))
    }
    const CommentExist=await CommentModel.findById(CommentID)
    if(!CommentExist){
        return next (new Error("IN_VALID COMMENT!",{cause:404}))
    }
    if(req.body.ReplyBody){
        ReplyBody=req.body.ReplyBody
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/replyPhotos/${customID}`})
        req.body.image={secure_url,public_id}
    }
    CommentExist.Replies.push(decode.id)
    await CommentExist.save()
    const reply=await ReplyModel.create(req.body)
    res.status(201).json({message:"REPLY ADDED SUCCESSFULLY!",reply})
})
export const Updatereply=asyncHandler(async(req,res,next)=>{//check first if the post still exist or not then check the existance of comment if both exist you can edit
    const{replyID}=req.params
    const{postID}=req.body
    const{commentID}=req.body
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
    const reply=await ReplyModel.findById(replyID)
    if(!reply){
        return next(new Error("IN_VALID REPLY!",{cause:400}))
    }
    if((reply.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    if(req.body.ReplyBody){
        reply.ReplyBody=req.body.ReplyBody
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/replyPhotos/${reply.customID}`})
        const image=await ReplyModel.findByIdAndUpdate(replyID,
            {image:{secure_url,public_id}},{new:false})
            await cloudinary.uploader.destroy(image.image.public_id)
    }
    await reply.save()
    res.status(200).json({message:'UPDATE SUCCESSFULLY!',reply})
   
})
export const Deletereply=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.query
    const{postID}=req.query
    const{replyID}=req.query
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
    const reply=await ReplyModel.findByIdAndDelete(replyID)
    if(!reply){
        return next(new Error("IN_VALID REPLY!",{cause:404}))
    }
    if((reply.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/replyPhotos/${reply.customID}`
    )
        //delete the folder its self
    await cloudinary.api.delete_folder(
        `Social_Media/${req.user._id}/commentPhotos/${postExist.customID}/replyPhotos/${reply.customID}`
    )
    res.status(200).json({message:"DELETED SUCCESS!",DeletedReply:reply})
})
export const LikeReply=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.query
    const{replyID}=req.query
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const commentExist=await CommentModel.findById(commentID)
    if(!commentExist){
        return next(new Error("IN_VALID COMMENT!",{cause:404}))
    }
    const ReplyExist=await ReplyModel.findById(replyID)
    if(!ReplyExist){
        return next(new Error("IN_VALID REPLY!"))
    }

    if(ReplyExist.Likes.includes(decode.id)){
        return next (new Error("YOU ALRAEDY LIKED THIS REPLY!",{cause:409}))
    }
    ReplyExist.Likes.push(decode.id)
    await ReplyExist.save()
    res.status(201).json({message:"REPLY LIKED SUCCESSFULLY!",ReplyExist})
})
export const UnLikeReply=asyncHandler(async(req,res,next)=>{
    const{commentID}=req.query
    const{replyID}=req.query
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const commentExist=await CommentModel.findById(commentID)
    if(!commentExist){
        return next(new Error("IN_VALID COMMENT!",{cause:404}))
    }
    const ReplyExist=await ReplyModel.findById(replyID)
    if(!ReplyExist){
        return next(new Error("IN_VALID REPLY!"))
    }
    if(!ReplyExist.Likes.includes(decode.id)){
        return next (new Error("YOU ALRAEDY UNLIKED THIS REPLY!",{cause:409}))
    }
    //remove the like
    ReplyExist.Likes.pull(decode.id)
    //save this change
    await ReplyExist.save()
    res.status(201).json({message:"YOU UNLIKE THIS REPLY!",ReplyExist})
})
