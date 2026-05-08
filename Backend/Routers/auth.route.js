const express = require('express') ; 
const { signUp, signIn, sendOTP, verfiyOtp, resetOtp, google, github } = require('../Controllers/auth.controller');
const authRouter = express.Router() ;

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.post('/forgetPassWord' , sendOTP); 
authRouter.post('/verifyOtp' , verfiyOtp);
authRouter.post('/resetPassword' , resetOtp) ;  
authRouter.post('/google' , google) ;  
authRouter.post("/github" , github) ; 


module.exports = authRouter;
