const errorMessage = (statusCode , statusMessage , success )=>{
    const error = new Error(statusMessage) ; 
    error.statusCode = statusCode; 
    error.success = success; 
    return error;
}
module.exports = { errorMessage };
