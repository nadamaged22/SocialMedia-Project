import { Router } from "express";
import * as pc from '../comment/controller/comment.js'
import { validation } from "../../MiddleWare/validation.js";
import * as validators from '../comment/comment.validation.js'
import { auth } from "../../MiddleWare/auth.js";
import { fileValidation, fileupload } from "../../utils/multer.js";
const router=Router()
router.post('/addcomment/:postID',auth,fileupload(fileValidation.image).single("image"),validation(validators.addcomment),pc.addcomment)
router.patch('/update/:commentID',auth,fileupload(fileValidation.image).single("image"),validation(validators.UpdateComment),pc.UpdateComment)
router.delete('/delete',auth,validation(validators.DeleteComment),pc.DeleteComment)
router.post('/Like/:commentID',auth,validation(validators.LikeComment),pc.LikeComment)
router.post('/UnLike/:commentID',auth,validation(validators.UNLIKEComment),pc.UnLikeComment)

export default router