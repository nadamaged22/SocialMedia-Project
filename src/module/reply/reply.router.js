import { Router } from "express";
import * as pc from '../reply/controller/reply.js'
import { validation } from "../../MiddleWare/validation.js";
import * as validators from '../User/user.validtion.js'
import { auth } from "../../MiddleWare/auth.js";
import { fileValidation, fileupload } from "../../utils/multer.js";
const router=Router()
router.post('/add',auth,fileupload(fileValidation.image).single("image"),pc.addreply)
router.patch('/update/:replyID',auth,fileupload(fileValidation.image).single("image"),pc.Updatereply)
router.delete('/delete',auth,pc.Deletereply)
router.post('/like',auth,pc.LikeReply)
router.post('/Unlike',auth,pc.UnLikeReply)

export default router