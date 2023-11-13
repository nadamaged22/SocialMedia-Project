import { nanoid } from "nanoid";
import userModel from "../../../../DB/model/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail, { createHtml } from "../../../utils/email.js";

export const GetUserProfile=asyncHandler(async(req,res,next)=>{//get the user info as its his own sitting page provided with all his posts
    const user=await userModel.findOne(req.user._id).populate([{
        path:'Post',
        // populate:[{
        //     path:'Comment'
        // }]
    }])

  res.status(200).json({message:"DONE",user}) 
})
export const UpdateUserProfile=asyncHandler(async(req,res,next)=>{
    const{_id}=req.user
    const{username,Email,age,phone}=req.body
    if(Email){
        const EmailExist=await userModel.findOne({Email})
        if(EmailExist){
            return next (new Error(`THIS EMAIL '${req.body.Email}'ALREADY EXIST!`,{cause:409}))
        }
        const code=nanoid(6)
        const Html=createHtml(code)
        sendEmail({to:req.body.Email,subject:"CONFIRM EMAIL",html:Html})
        req.body.code=code
        const user =await userModel.findByIdAndUpdate({_id},{
            $set:{
                confirmEmail:'false',
                'code.code':code
            }
        },{new:true})


    }if(req.file){//used this here to enable me use file instade of body

        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`SocialMedia/profile`})
         req.body.Profileimage={secure_url,public_id}
    }
    const user =await userModel.findByIdAndUpdate({_id},{username,Email,age,phone},{new:true}) 
    res.json({message:"UPDATED SUCCESS!",user})
})
export const AddProfilePIC=asyncHandler(async(req,res,next)=>{
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/ProfilePhoto`})
    const ProfilePhoto=await userModel.findByIdAndUpdate(req.user._id,
        {Profileimage:{secure_url,public_id}},{new:true})
    res.status(201).json({message:"ADDED SUCCESS!",ProfilePhoto})
})
export const AddCoverePIC=asyncHandler(async(req,res,next)=>{
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Social_Media/${req.user._id}/CoverPhoto`})
    const CoverPhoto=await userModel.findByIdAndUpdate(req.user._id,
        {coverImage:{secure_url,public_id}},{new:true})
    res.status(201).json({message:"ADDED SUCCESS!",CoverPhoto})
})


export const SoftDelete=asyncHandler(async(req,res,next)=>{
    const{_id}=req.user
    const user=await userModel.findByIdAndUpdate({_id},{isDeleted:true},{new:true})
    if(!user){
        return next(new Error("FAILIED TO DELETE USER!",{cause:404}))
    }
    res.status(200).json({message:"ACCOUNT DELETED SUCCESSFULLY!"})

})