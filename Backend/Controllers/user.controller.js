const test = async(req,res, next)=>{
    res.json({message : "Api Is Working..."}) ;
}

const updateUser = async(req,res,next)=>{
    //  Before Reaching This function First Check User Is Authenticate. 
}

module.exports = {test} ; 