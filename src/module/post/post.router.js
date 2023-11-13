import { Router } from "express";
import * as pc from '../post/controller/post.js'
import { validation } from "../../MiddleWare/validation.js";
import * as validators from '../post/post.validation.js'
import { auth } from "../../MiddleWare/auth.js";
import { fileValidation, fileupload } from "../../utils/multer.js";
const router=Router()
router.post('/addpost',auth,fileupload(fileValidation.image).fields([{name:'Images',maxCount:5}]),validation(validators.addpost),pc.addpost)
router.post('/addvideo',auth,fileupload(fileValidation.video).fields([{name:'Videos',maxCount:5}]),pc.addVideo)
router.patch('/update/:id',auth,fileupload(fileValidation.image).fields([{name:'Images',maxCount:5}]),validation(validators.updatepost),pc.updatepost)
router.delete('/delete/:id',auth,validation(validators.DeletePost),pc.DeletePost)
router.get('/getposts/:id',auth,validation(validators.GetPostByID),pc.GetPostByID)
router.get('/getposts',auth,validation(validators.GetPosts),pc.GetPosts)
router.get('/getYesterdayPosts',auth,validation(validators.GetPostsCreatedYesterday),pc.GetPostsCreatedYesterday)
router.get('/getTodayPosts',auth,validation(validators.GetPostsCreatedToday),pc.GetPostsCreatedToday)
router.post('/like/:postID',validation(validators.LikePost),pc.LikePost)
router.post('/unlike/:postID',validation(validators.UnLikePost),pc.UnLikePost)
export default router