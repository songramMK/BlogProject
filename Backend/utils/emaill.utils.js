const nodemailer = require("nodemailer");
const dotenv = require('dotenv') ; 
dotenv.config() ; 

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendOtpEmail = async(to, otp) =>{
       await transporter.sendMail({
        from: process.env.EMAIL, 
        to, 
        subject: "Reset Your Password",
        text: "Hello User?", // Plain-text version of the message
        html: `<b>Hello ${to} </b> , Your OTP FOR PASSWORD RESET IS <b>${otp} . It Expire In 5 minute</b>`, // HTML version of the message
      });
}

const SendGeneratePassword = async(to , password)=>{
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject:
      "PASSWORD GENERATE WHEN YOU AUTHENTICATE BY USING GOOGLE , FACEBOOK , GITHUB",
    text: "Hello User ? ",
    html: `<b>Hello ${to} </b> , This Is Your New Password <b>${password} .</b>`, // HTML version of the message
  });
}

module.exports = { sendOtpEmail, SendGeneratePassword };