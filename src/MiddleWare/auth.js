import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../../DB/model/user.model.js";



export const auth=asyncHandler(async(req,res,next)=>{
    try{
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        const authUser = await userModel.findById(decoded.id).select('-password')
            if (!authUser) {
                return res.json({ message: "Not register account" })
            }
        req.user = authUser;
            return next()
        } 
        catch (error) {
            return res.json({ message: "Catch error" , err:error?.message })
        }
    })