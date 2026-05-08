const User = require("../models/user.model.js");
const { sendOtpEmail, SendGeneratePassword } = require("../utils/emaill.utils");
const { errorMessage } = require("../utils/error.utils");
const {
  HashPasswordGen,
  CompareHashPassword,
} = require("../utils/hashPass.utils");
const otpGenerate = require("../utils/otpGenerate.utils.js");
const response = require("../utils/response.utils.js");
const {
  getRefreshToken,
  getAccessToken,
  getCookiePayload,
  validRefreshToekn,
} = require("../utils/token.utils");

const signUp = async (req, res, next) => {
  try {
    const { UserName, email, password } = req.body;
    if (
      !UserName ||
      !email ||
      !password ||
      password === "" ||
      email === "" ||
      UserName === ""
    ) {
      // If Data missing status code will be 400
      return next(errorMessage(400, "All Fields Are Required", false));
    }
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      // if Data Already Exist Status Code will be 409
      return next(errorMessage(409, "Already Exist", false));
    }
    // const HashPassword = await HashPasswordGen(password);
    const NewUser = await User.create({
      UserName,
      email,
      password,
    });

    const payload = {
      userId: NewUser._id,
      email: NewUser.email,
      isAdmin : NewUser.isAdmin 
    };

    //   RefreshToken যার মেয়াদ বেশি হয়ে থাকে । এবং যা ডাটাবেস এ ও সেইভ থাকে
    const refreshToken = getRefreshToken(payload);
    //   AccessToken যার মেয়াদ RefreshToken এর থেকে কম থাকে । এইটা ডাটাবেস এ সেইভ থাকে না ।
    const accessToken = getAccessToken({ userId: NewUser._id  , isAdmin : NewUser.isAdmin});
    const cookieOption = getCookiePayload();

    await User.findByIdAndUpdate(NewUser._id, {
      $push: {
        refreshToken: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    const safeUser = {
      _id: NewUser._id,
      UserName: NewUser.UserName,
      email: NewUser.email,
      isAdmin: NewUser.isAdmin,
      profilePicture : NewUser.profilePicture 
    };

      return response(res, 201 , "User Create Successfully", safeUser);
  } catch (error) {
    // next(errorMessage(500, 'Internal Server Error' , false)) amra ekhane eita use korbo na karon
    /*
errorMessage() ব্যবহার করা হয় তখন, যখন তুমি নিজে থেকে নতুন error তৈরি করছো
 next(error) ব্যবহার করা হয় তখন, যখন error নিজে থেকেই এসেছে
 original error destroy hoye jabe 
    */
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorMessage(400, "ALL Fields Are Required", false));
    }
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) {
      // jodi data missing thake tokhon status code 404
      return next(errorMessage(404, "User Not Found", false));
    }
    try {
      const HashPassword = await validUser?.password;
      const isPasswordMatch = await CompareHashPassword(password, HashPassword);
      if (!isPasswordMatch) {
        return next(errorMessage(401, "Invalid User", false));
      }
    } catch (error) {
      return next(errorMessage(500, "INTERNAL SERVER ERROR", false));
    }

    const Payload = {
      userId: validUser._id,
      email,
      isAdmin : validUser.isAdmin
    };

    const refreshToken = getRefreshToken(Payload);
    const accessToken = getAccessToken({ userId: validUser._id , isAdmin : validUser.isAdmin });
    const createCookie = getCookiePayload();

    await User.findByIdAndUpdate(validUser._id, {
      $push: {
        refreshToken: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.cookie("refreshToken", refreshToken, createCookie);
    res.cookie("accessToken", accessToken, createCookie);

    const safeUser = {
      _id: validUser._id,
      UserName: validUser.UserName,
      email: validUser.email,
      isAdmin: validUser.isAdmin,
      profilePicture : validUser.profilePicture,
    };
    // যখন আমি কোনো resource সফলভাবে পেয়ে যাবো বা successfully put/patch হলে বা কোন কিছু successfully delete হলে । মানে কোন অপারেশন  কিছু যখন সফল ভাবে সম্পন্ন হয় ।
  
    return response(res, 200 , "SignIn Successfully" , safeUser) ; 
  } catch (error) {
    next(error);
  }
};



const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "All Fields Are Required..." });
    }
    // res.json({"email: ":  email});
    const newUser = await User.findOne({ email });
    // res.json({"NewUser: ": newUser}) ;
    if (!newUser) {
      return res.status(400).json({ message: "User Does Not Find..." });
    }
    const otp = otpGenerate() ; 
    //  res.json({"OTP": otp});
    newUser.resetOtp = otp;
    newUser.otpExpired = new Date(Date.now() + 5 * 60 * 1000);
    newUser.isOtpVerified = false;
    //  res.json({newUser});
    await newUser.save();
    await sendOtpEmail(email, otp);
 
    return response(res, 200 , " OTP SEND SUCCESSFULLY" )
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR..." });
  }
};

const verfiyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp || email == "" || otp == "") {
      return res.status(400).json({ message: "PLEASE FILL UP OTP" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "USER DOES NOT EXIST" });
    }
    if (user.resetOtp !== otp) {
      return res.status(401).json({ message: "INVALID OTP" });
    }
    if (user.otpExpired < Date.now()) {

      return res.status(401).json({ message: "OTP EXPIRED... RESEND OTP" });
    }

    user.otpExpired = undefined;
    user.isOtpVerified = true;
    user.resetOtp = undefined;

    await user.save();

    return response(res, 200 , "OTP VERIFIED SUCCESSFULLY" ) ; 
  } catch (error) {
    return response(res, 500 , "INTERNAL SERVER ERROR") ; 
  }
};

const resetOtp = async (req, res) => {
  try {
    const { email, Newpassword } = req.body;
    if (!email || !Newpassword || email == "" || Newpassword == "") {
      return res.status(400).json({ message: "ALL FIELDS REQUIRED" });
    }
    const UserFind = await User.findOne({ email });
    if (!UserFind) {
      return res.status(404).json({ message: "User NOt Find" });
    }
    if (!UserFind.isOtpVerified) {
      return res.status(401).json({ message: "OTP IS NOT VERIFIED" });
    }
    // const HashPassword = await HashPasswordGen(Newpassword);
    UserFind.password = Newpassword;
    UserFind.isOtpVerified = false;
    await UserFind.save();
    return response(res, 200 , "RESET PASSWORD SUCCESSFULLY" ) ;
  } catch (error) {
    return response(res, 500 , "INTERNAL SERVER ERROR" ) ; 
  }
};

const google = async (req, res, next) => {
  try {
    const { email, profilePhotoUrl, displayName } = req.body;
    const user = await User.findOne({ email });

    // যদি already user থেকে থাকে তাহলে login করব নয়ত signIn
    if (user) {
      const Payload = {
        userId: user._id,
        email,
        isAdmin : validUser.isAdmin 
      };

      const refreshToken = getRefreshToken(Payload);
      const accessToken = getAccessToken({
        userId: user._id,
        isAdmin: validUser.isAdmin,
      });
      const createCookie = getCookiePayload();

      await User.findByIdAndUpdate(user._id, {
        $push: {
          refreshToken: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      res.cookie("refreshToken", refreshToken, createCookie);
      res.cookie("accessToken", accessToken, createCookie);

      const safeUser = {
        _id: user._id,
        UserName: user.UserName,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture, 
      };
      return response(res, 200 , "GOOGLE SIGNIN SUCCESSFULLY" , safeUser) ;
    } else {
      const password =
        // Math.random() মানে আমরা জানি ০-০.৯৯৯৯৯৯৯৯৯৯ পর্যন্ত value আসতে পারে কিন্তু ১ আসবে না
        // slice বলতে বুঝি last এর ৮ টা character আসবে।
        // toString(৩৬) বলতে ০-৯ তারপর a-z পর্যন্ত character আসবে আর ০-৯ এর যে number তা character এ convert করে দেন।
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const newUser = await User.create({
        UserName:
          // Songram Modak --> songram modak
          // split(" ") --> ["songram" , "modak"]
          //join --> songrammodak
          //toString(9) --> মানে ০-৮ পর্যন্ত সংখ্যা থাকবে ৯-a-z পর্যন্ত সংখ্যা  থাকবে না

          displayName.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password,
        profilePicture : profilePhotoUrl,
      });

      const Payload = {
        userId: newUser._id,
        email,
      };

      const refreshToken = getRefreshToken(Payload);
      const accessToken = getAccessToken({ userId: newUser._id });
      const createCookie = getCookiePayload();

      await User.findByIdAndUpdate(newUser._id, {
        $push: {
          refreshToken: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      SendGeneratePassword(newUser.email, password); 


      res.cookie("refreshToken", refreshToken, createCookie);
      res.cookie("accessToken", accessToken, createCookie);

      const safeUser = {
        _id: newUser._id,
        UserName: newUser.UserName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        profilePicture : newUser.profilePicture
      };
      return response( res,201 , "Google SignUp Successfully" , safeUser) ;
    }
  } catch (error) {
    next(error);
  }
};

const github = async (req, res, next) => {
  try {

    const { UserName, profilePhotoUrl, email } = req.body;
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      //  যদি থেকে থাকে তাহলে login হবে
      const payload = {
        userId: ExistUser._id,
        email,
        isAdmin: validUser.isAdmin,
      };
      const refreshToken = getRefreshToken(Payload);
      const accessToken = getAccessToken({
        userId: ExistUser._id,
        isAdmin: validUser.isAdmin,
      });
      const createCookie = getCookiePayload();

      await User.findByIdAndUpdate(ExistUser._id, {
        $push: {
          refreshToken: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      res.cookie("refreshToken", refreshToken, createCookie);
      res.cookie("accessToken", accessToken, createCookie);

      const safeUser = {
        _id: ExistUser._id,
        UserName: ExistUser.UserName,
        email: ExistUser.email,
        isAdmin: ExistUser.isAdmin,
      };
      return response(res, 200 , "GITHUB SIGNIN SUCCESSFULLY" , safeUser) ;
    } else {
      // আর যদি না থেকে থাকে তাহলে signUp হবে।

      const password = Math.random().toString(36).slice(-8) 

      const newUser = await User.create({
        UserName,
        email,
        password,
        profilePicture : profilePhotoUrl
      });


        const Payload = {
          userId: newUser._id,
          email,
        };

        const refreshToken = getRefreshToken(Payload);
        const accessToken = getAccessToken({ userId: newUser._id });
        const createCookie = getCookiePayload();

        await User.findByIdAndUpdate(newUser._id, {
          $push: {
            refreshToken: {
              token: refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        });


        res.cookie("refreshToken", refreshToken, createCookie);
        res.cookie("accessToken", accessToken, createCookie);

        const safeUser = {
          _id: newUser._id,
          UserName: newUser.UserName,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          profilePicture: newUser.profilePicture, 
        };

        SendGeneratePassword(newUser.email, password); 

        return response(res, 201 , " Github SignUp Successfully" ,safeUser )


    }
  } catch (error) {
    next(error);
  }
};






const refreshToken = async (req, res, next) => {
  try {
    // first of all cookie theke refreshToken TA nitesi
    const RefreshTokenExist = req.cookies.refreshToken;

    if (!RefreshTokenExist) {
      // jodi cookie ta na thake tahole error dibo
      return next(errorMessage(401, "Please Login Again", false));
    }
    let ValidRefreshToken;
    try {
      // valid ki na check kortesi
      ValidRefreshToken = validRefreshToekn(RefreshTokenExist);
      if (!ValidRefreshToken) {
        // na hole error
        return next(errorMessage(401, "Please Login Again", false));
      }
    } catch (error) {
      next(error);
    }

    // valid jehetu tai er vitore user id ache seta nitesi
    const UserId = ValidRefreshToken.userId;

    const user = await User.findById(UserId);
    // token theke je userId use kore user peyechi ei user ta authentic ki na ta check kortesi
    if (!user) {
      return next(errorMessage(401, "Please Login Again", false));
    }

    //  ekhon user er vitore je refresh token array ta ache ta niyechi
    const StoreRefreshToken = user?.refreshToken;

    //  ekhon ei array te amar refresh token ta ache kina ta find kortesi
    const ExistRefreshToken = StoreRefreshToken?.find((t) => {
      return t?.token === RefreshTokenExist;
    });

    //  jodi na thake tahole abar error ditesi
    if (!ExistRefreshToken) {
      return next(errorMessage(401, "Please Login Again", false));
    }

    //  jodi thake kintu expire hoye giyeche tahole abar error ditesi
    if (new Date(ExistRefreshToken.expiresAt) < Date.now()) {
      return next(errorMessage(401, "Please Login Again", false));
    }
    const payload = {
      userId: user._id,
      email: user.email,
      isAdmin: validUser.isAdmin,
    };

    const createCookie = getCookiePayload();

    // accesstoken generate kortesi
    const accessToken = getAccessToken(payload);
    res.cookie("accessToken", accessToken, createCookie);

    // jodi succefully kichu create hoy tokhon 201
    return res.status(200).json({
      message: "New AccessToken Generate",
      status: true,
      status_code: 201,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  signUp,
  signIn,
  google,
  refreshToken,
  sendOTP,
  verfiyOtp,
  resetOtp,
  github
};
