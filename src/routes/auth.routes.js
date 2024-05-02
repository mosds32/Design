import { Router } from "express";
import {
    signUp,login,otpVerify, resendOTP, forgetPassword, logout
   
} from "../controllers/auth.controller.js";
import authentication from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);

router.route('/otp-verify').post(authentication,otpVerify);

router.route('/resend-otp').post(resendOTP);

router.route('/change-password').post(forgetPassword);

router.route('/logout').get(authentication,logout);


export default router;