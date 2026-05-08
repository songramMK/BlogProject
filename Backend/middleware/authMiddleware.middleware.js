const jwt = require('jsonwebtoken') ; 
const dotenv = require("dotenv") ; 
dotenv.config(); 
const response = require('../utils/response.utils');
const authMiddleware = (req,res,next)=>{
    const AuthToken = req.cookies?.accessToken; 
    if(!AuthToken){
        return response(res, 401 , "Authorization Token Missing... Please Login First") ; 
    }
    try{
        const decode = jwt.verify(AuthToken, process.env.Access_secret_key );
        req.user = decode ; 
        next() ; 
    }catch(error){
        console.error(error) ; 
        return response(res, 500 , "INTERNAL SERVER ERROR") ; 
    }
}
module.exports = authMiddleware ; 