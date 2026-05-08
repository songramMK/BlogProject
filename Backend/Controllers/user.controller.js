const { uploadFileToCloudinary } = require("../config/cloudinary.config");
const User = require("../models/user.model");
const { errorMessage } = require("../utils/error.utils");
const response = require("../utils/response.utils");


const UpdateUser = async(req,res,next)=>{
    try{
      //  Before Reaching This function First Check User Is Authenticate.
      if (req.user.userId !== req.params.userId) {
        return next(errorMessage(403, "YOU CAN ONLY UPDATE YOUR OWN ACCOUNT"));
      }
      const updateUser = {};
      if (req.body.UserName) {
        if (req.body.UserName.length < 3 || req.body.UserName.length > 16) {
          return next(
            errorMessage(
              400,
              "UserName Must Be between 3 character to 15 character",
            ),
          );
        }
        if (req.body.UserName.includes(" ")) {
          return next(
            errorMessage(
              400,
              "UserName Must Be between 3 character to 15 character",
            ),
          );
        }
        if (req.body.UserName !== req.body.UserName.toLowerCase()) {
          req.body.UserName = req.body.UserName.toLowerCase();
        }
        if (!req.body.UserName.match(/^[a-zA-Z0-9]+$/)) {
          return next(
            errorMessage(
              400,
              "UserName Must Be between 3 character to 15 character",
            ),
          );
        }
        updateUser.UserName = req.body.UserName;
      }
      if (req.body.password) {
        const userFind = await User.findById(req.params.userId);
        if (userFind) {
          userFind.password = req.body.password;
          await userFind.save();
        }
        /*
            আমরা এখানেই update করে ফেলেছি কারণ আমরা যদি findByIdAndUpdate method use করে করতাম 
            তাহলে আমাদের password plaintext এ save হয়ে যেত database এ. তখন আর hashPassword 
            middleware userSchema কাজ করতো না. এর জন্য আমাদের আগে password কে hashPassword 
            function দিয়ে hash করতে হবে. 

            const hashPassword = HashPassword(password) ; 
            updateUser.password = hashPassword; 

            এভাবে আমরা না করে তাই আমরা এভাবে করেছি. 
            
        */
      }
      if (req.file) {
        const UploadUrl = await uploadFileToCloudinary(req.file);
        if (UploadUrl?.secure_url) {
          updateUser.profilePicture = UploadUrl?.secure_url;
        }
      }
      const UpdateUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: updateUser,
        },
        { new: true },
      );

      return res.status(200).json(UpdateUser);
    }catch(error){
        next(error);
    }
  
    

}

const deleteUser = async(req,res,next) =>{
    try{
        if(req.user.userId !== req.params.userId){
            return next(
              response(res, 403, "You can only update your own account!"),
            ); 
        }
        await User.findByIdAndDelete(req.params.userId)
        return response(res, 200 , "User Deleted SuccessFully...") ; 
    }catch(error){
        next(error);
    }
}
const SignOut = async(req, res, next)=>{
    try{

        res.clearCookie("accessToken")
        .status(200).json("User Has Been LogOut Successfully...");
    }catch(error){
        next(error) ; 
    }
}

module.exports = { UpdateUser , deleteUser , SignOut}; 