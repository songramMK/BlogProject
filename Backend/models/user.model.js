const mongoose = require('mongoose') ; 
const { HashPasswordGen } = require('../utils/hashPass.utils');
const userSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select  : false , 
      minLength : [6, "Password Atleast 6 character present"] , 
      maxLength : [16 , "Password at most 16 character present"] , 
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // OTP PART START
    resetOtp : {
      type : String , 
    },
    isOtpVerified : {
      type : Boolean , 
      default : false , 
    },
    otpExpired : {
      type : Date, 
    },
    // OTP PART END


    refreshToken: [
      // refreshToken ja longterm hoy ar database e save thake
      // longterm & save database
      {
        token: {
          type: String,
          required: true,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save" , async function(next){
  try{
    if(!this.isModified("password")){
      return next() ; 
    }
    this.password = await HashPasswordGen(this.password);
    next() ; 
  }catch(error){

  }
})
const User = mongoose.model("User", userSchema);

module.exports = User; 