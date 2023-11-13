import { nanoid } from "nanoid";
import PostModel from "../../../../DB/model/post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/model/user.model.js";
import Jwt from "jsonwebtoken";
import CommentModel from "../../../../DB/model/comment.model.js";
import { DateTime } from "luxon";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { paginationfunction } from "../../../utils/pagination.js";

export const addpost=asyncHandler(async(req,res,next)=>{
    const UserExist=await userModel.findById(req.user._id)//check if the user exist or loged in or not
    if(!UserExist){
        return next (new Error("USER MUST BE LOGED IN !",{cause:401}))
    }
   const content=req.body
    const customID=nanoid()
    req.body.customID=customID
    req.body.createdBy=req.user._id
    const Images=[]
    const publicids=[]
    if(req.files.Images?.length){
    for(const file of req.files.Images ){
        const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`Social_Media/${req.user._id}/PostPhotos/${customID}/photos`})
        Images.push({secure_url,public_id})
        publicids.push({public_id}) //3l4an lw 7asal 2y mo4kla 23rf amsa7
    }
    req.body.Images=Images
    }
    // if(req.files.Videos){//used this here to enable me use file instade of body

    // const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.Videos[0].path,{folder:`Social_Media/${req.user._id}/PostPhotos/${customID}/photos`})
    // req.body.Videos={secure_url,public_id}
    // }
    
    // const Videos=[]
    // const publicids2=[]
    // if(req.files.Videos?.length){
    // for(const file of req.files.Videos ){
    //     const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{resource_type:'video',folder:`Social_Media/${req.user._id}/PostPhotos/${customID}/videos`})
    //     Videos.push({secure_url,public_id})
    //     publicids2.push({public_id}) //3l4an lw 7asal 2y mo4kla 23rf amsa7
    // }
    // req.body.Videos=Videos
    // }
    const post=await PostModel.create(req.body)
    res.status(201).json({message:'POST ADDED SUCCESSFULLY!',post})
})
export const addVideo=asyncHandler(async(req,res,next)=>{
    const UserExist=await userModel.findById(req.user._id)//check if the user exist or loged in or not
    if(UserExist.isDeleted){
        return next (new Error("THIS USER IS DELETED !",{cause:404}))
    }
    if(!UserExist){
        return next (new Error("USER MUST BE LOGED IN !",{cause:401}))
    }
    const customID=nanoid()
    req.body.customID=customID
    req.body.createdBy=req.user._id
    const Videos=[]
    const publicids2=[]
    if(req.files.Videos?.length){
    for(const file of req.files.Videos ){
        const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{resource_type:'video',folder:`Social_Media/${req.user._id}/PostPhotos/${customID}/videos`})
        Videos.push({secure_url,public_id})
        publicids2.push({public_id}) //3l4an lw 7asal 2y mo4kla 23rf amsa7
    }
    req.body.Videos=Videos
    }
    const post=await PostModel.create(req.body)
    res.status(201).json({message:'POST ADDED SUCCESSFULLY!',post})




})
export const updatepost=asyncHandler(async(req,res,next)=>{ //i tried making this one in better way using the comapre between req.user._id and post.createdBy but it didnt work 
    const{id}=req.params
    const{authorization}=req.headers //to check if the user logged bow is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)

    const post=await PostModel.findById(id)
    if(!post){
        return next (new Error("THIS POST IS NOT EXIST!",{cause:400}))
    }
    if((post.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    const Images=[] //hold new photos
    if(req.files.Images?.length){
        for(const file of req.files.Images){
            const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`Social_Media/${req.user._id}/PostPhotos/${customID}/photos`})
            Images.push({secure_url,public_id})
        }
        let public_ids=[]//hold old images
        for(const image of post.Images){
            public_ids.push(Images.public_id)
        }
        await cloudinary.api.delete_resources(public_ids)
        post.Images=Images
    }
    if(req.body.content){
        post.content=req.body.content
    }
    if(req.body.privacy){
        post.privacy=req.body.privacy
    }
    await post.save()
    res.status(200).json({message:"UPDATED SUCCESSFULLY!",post})
})
export const DeletePost=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)

    const post=await PostModel.findByIdAndDelete(id)
    if(!post){
        return next(new Error("IN_VALID POST",{cause:404}))
    }
    if((post.createdBy!=decode.id)){
        return next(new Error("YOU ARE NOT AUTHORIZED!",{cause:401}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `Social_Media/${req.user._id}/PostPhotos/${post.customID}`
    )
        //delete the folder its self
    await cloudinary.api.delete_folder(
        `Social_Media/${req.user._id}/PostPhotos/${post.customID}`
    )
    //delete related comments
    const RelatedComments=await CommentModel.deleteMany({postID:id})
    if(!RelatedComments.deletedCount){
        return next (new Error('FAILED TO DELETE RELATED COMMENTS',{cause:400}))
    }
    res.status(200).json({message:"DELETED SUCCESS!",DeletedPost:post})

})
export const GetPostByID=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const post=await PostModel.findById(id)
    if(!post){
        return next(new Error("IN_VALID POST ID!",{cause:404}))
    }
    const Posts=await PostModel.findById(id)
    res.status(200).json({message:"DONE",Post:Posts})

})
export const GetPosts=asyncHandler(async(req,res,next)=>{
    const mongoseQuery=PostModel.find()
    const apiFeatures=new ApiFeatures(mongoseQuery,req.query).filter().sort().fields().search()
    const {page,size}=req.query
    const {limit,skip}=paginationfunction({page,size})
    mongoseQuery.skip(skip).limit(size)
    const posts=await apiFeatures.mongoseQuery
    return res.status(200).json({message:"DONE",posts})

})
export const GetPostsCreatedYesterday=asyncHandler(async(req,res,next)=>{
    const yesterdayStart = DateTime.now().minus({ days: 1 }).startOf('day').toJSDate();
    const yesterdayEnd = DateTime.now().minus({ days: 1 }).endOf('day').toJSDate();
    const posts=await PostModel.aggregate([{
        $match: {
            createdAt: {
            $gte: yesterdayStart,
              $lte:yesterdayEnd
            }
        }
}])
    res.status(200).json({message:"DONE",posts})
})
export const GetPostsCreatedToday=asyncHandler(async(req,res,next)=>{
    // const date= Date.now()
    const todayStart = DateTime.now().startOf('day').toJSDate();
    const todayEnd = DateTime.now().endOf('day').toJSDate();
    const posts=await PostModel.aggregate([{
        $match: {
            createdAt: {
                $gte: todayStart,
                $lte: todayEnd
            }
        }
}])
    res.status(200).json({message:"DONE",posts})
})
export const LikePost=asyncHandler(async(req,res,next)=>{
    const{postID}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const PostExist=await PostModel.findById(postID)
    if(!PostExist){
        return next(new Error("IN_VALID POST!",{cause:404}))
    }
    if(PostExist.Likes.includes(decode.id)){
        return next (new Error("YOU ALRAEDY LIKED THIS POST!",{cause:409}))
    }
    PostExist.Likes.push(decode.id)
    await PostExist.save()
    res.status(201).json({message:"POST LIKED SUCCESSFULLY!",PostExist})

})
export const UnLikePost=asyncHandler(async(req,res,next)=>{
    const{postID}=req.params
    const{authorization}=req.headers //to check if the user logged now is the one who created this post
    const token=authorization.split(process.env.BEARER_KEY)[1]
    const decode=Jwt.verify(token,process.env.TOKEN_SIGNATURE)
    const PostExist=await PostModel.findById(postID)
    if(!PostExist){
        return next(new Error("IN_VALID POST!",{cause:404}))
    }
    if(!PostExist.Likes.includes(decode.id)){
        return next (new Error("YOU DID NOT LIKE THIS POST!",{cause:409}))
    }
    //remove the like
    PostExist.Likes.pull(decode.id)
    //save this change
    await PostExist.save()
    res.status(201).json({message:"YOU UNLIKE THIS POST!",PostExist})

})
