const response = (res, statusCode , message , data = null) =>{
    if(!res){
        return ; 
    }
    const ResponseObject = {
        status : statusCode < 400 ? "success" : "error", 
        statusCode, 
        message, 
        data 
    }
    return res.status(statusCode).json(ResponseObject) ;
}
module.exports = response ; 