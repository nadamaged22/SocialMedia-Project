import { nanoid } from "nanoid";
import userModel from "../../../../DB/model/user.model.js";
import { compare, hash } from "../../../utils/HashandCompare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
import sendEmail, { createHtml } from "../../../utils/email.js";
import { generateToken } from "../../../utils/GenerateandVerify.js";
import { DateTime } from "luxon";
export const SignUp=asyncHandler(async(req,res,next)=>{
    const ISEmailExist=await userModel.findOne({Email:req.body.Email})
    if(ISEmailExist){
        return next (new Error (`THIS EMAIL '${req.body.Email}'ALREADY EXIST!`,{cause:409}))
    }
    req.body.phone=CryptoJS.AES.encrypt(req.body.phone,process.env.ENCRYPTION_KEY).toString()
    req.body.password=hash(req.body.password)
 
    const code=nanoid(6)
    const Html=createHtml(code)
    sendEmail({to:req.body.Email,subject:"CONFIRM EMAIL",html:Html})
    let expirationTime = DateTime.now()
    expirationTime=expirationTime.toMillis()
    req.body.code={code}
    req.body.code.expdate=expirationTime
    const user=await userModel.create(req.body)
    res.status(201).json({message:"SIGNUP SUCCESSFULLY",user})
})
export const confirmEmail=asyncHandler(async(req,res,next)=>{
    const{Email,code}=req.body
    const ISEmailExist=await userModel.findOne({Email})
    if(!ISEmailExist){
        return next (new Error (`THIS EMAIL '${req.body.Email}'NOT FOUND !`,{cause:404}))
    }
    if(code!=ISEmailExist.code.code){
        return next (new Error("IN_VALID CODE!",{cause:400}))
    }
    const Newcode=nanoid(6) //generate a new code so that the old one expire after one trial
    const confirmedUser=await userModel.updateOne({Email},{
        $set:{
            confirmEmail:'true',
            'code.code':Newcode

        }
    })
    res.status(200).json({message:"CONFIRMATION SUCCESS",confirmedUser})

})
export const Login=asyncHandler(async(req,res,next)=>{
    const {Email,password}=req.body
    const user=await userModel.findOne({Email})
    if(user.isDeleted){
        return next(new Error('THIS ACCOUNT IS DELETED!',{cause:404}))
    }
    if(!user){
        return next (new Error(`THIS EMAIL '${req.body.Email}'NOT FOUND !`,{cause:404}))
    }
    const match=compare(password,user.password)
    if(!match){
        return next (new Error("IN_VALID USER INFO!"),{cause:404})
    }
    const payload={
        id:user._id,
        Email:user.Email
    }
    if(user.confirmEmail){
        const token=generateToken({payload})
        res.status(200).json({message:"LOGIN SUCCESS!",token})
    }
    return next(new Error("PLEASE CONFIRM YOUR EMAIL FIRST!"))
})
//send another code when forget password
export const sendcode=(async(req,res,next)=>{
    const{Email}=req.body
    const user=await userModel.findOne({Email})
    if(!user){
        return next (new Error((`THIS EMAIL '${req.body.Email}'NOT FOUND !`,{cause:404})))
    }
    let expirationTime = DateTime.now().plus({ minutes: 2})
    expirationTime=expirationTime.toMillis()
    const code=nanoid(6)
    const Html=createHtml(code)
    sendEmail({to:req.body.Email,subject:"RESET PASSWORD!",html:Html})
    await userModel.updateOne({Email},{
        $set:{
            'code.code':code,
            'code.expdate':expirationTime
        }
    })
    res.status(200).json({message:"CODE SEND TO EMAIL!"})
})
export const ResetPassword=asyncHandler(async(req,res,next)=>{
    let{Email,code,password}=req.body
    const user=await userModel.findOne({Email})
    if(!user){
        return next (new Error((`THIS EMAIL '${req.body.Email}'NOT FOUND !`,{cause:404})))
    }
    if(code!=user.code.code){
        return next(new Error("IN_VALID CODE!",{cause:400}))
    }
    const match=compare(password,user.password)
    if(match){
        return next (new Error("PLEASE ENTER NEW PASSWORD!"),{cause:404})
    }
    const currentMillis = DateTime.now().toMillis();
    if(currentMillis>user.code.expdate){
        return next(new Error("CODE EXPIRED!"))
    }
  password=hash(password)
  const Newcode=nanoid(6) 
  await userModel.updateOne({Email},{
      password,
      code:Newcode
  })
  res.status(200).json({message:"PASSWORD UPDATED SUCCESSFULLY!"})

   

})
