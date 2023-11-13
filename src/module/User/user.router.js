import { Router } from "express";
import * as pc from '../User/controller/user.js'
import { validation } from "../../MiddleWare/validation.js";
import * as validators from '../User/user.validtion.js'
import { auth } from "../../MiddleWare/auth.js";
import { fileValidation, fileupload } from "../../utils/multer.js";
const router=Router()
router.get('/getuser',auth,validation(validators.GetUserProfile),pc.GetUserProfile)
router.patch('/update',auth,fileupload(fileValidation.image).single("image"),validation(validators.UpdateUserProfile),pc.UpdateUserProfile)
router.patch('/updateprofilePIC',auth,fileupload(fileValidation.image).single("image"),validation(validators.AddProfilePIC),pc.AddProfilePIC)
router.patch('/delete',auth,pc.SoftDelete)

export default router