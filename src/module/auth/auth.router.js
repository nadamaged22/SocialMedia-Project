import { Router } from "express";
import * as pc from '../auth/controller/registeration.js'
import { validation } from "../../MiddleWare/validation.js";
import * as validators from '../auth/auth.validation.js'
const router=Router()
router.post('/signUP',validation(validators.SignUp),pc.SignUp)
router.patch('/confirm',validation(validators.confirmEmail),pc.confirmEmail)
router.post('/login',validation(validators.LogIn),pc.Login)
router.patch('/sendcode',validation(validators.sendCode),pc.sendcode)
router.patch('/reset',validation(validators.ResetPassword),pc.ResetPassword)

export default router