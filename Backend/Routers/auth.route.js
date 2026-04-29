const express = require('express') ; 
const { signUp, signIn, sendOTP, verfiyOtp, resetOtp, google } = require('../Controllers/auth.controller');
const authRouter = express.Router() ;

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.post('/forgetPassWord' , sendOTP); 
authRouter.post('/verifyOtp' , verfiyOtp);
authRouter.post('/resetPassword' , resetOtp) ;  
authRouter.post('/google' , google) ;  


module.exports = authRouter;
