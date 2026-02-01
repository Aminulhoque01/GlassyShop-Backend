import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/emailService.js";
import VerificationEmail from "../helper/sendVerificationEmail.js";
import UserModel from "../models/user.model.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 10 * 60 * 1000,
      verify_email: false, // ✅ explicitly set
    });

    await sendEmail(
      email,
      "Verify email from E-commerce App",
      "",
      VerificationEmail(name, verifyCode),
    );

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "User registered successfully! Please verify your email.",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}



export async function verifyEmailController(request,response){
  try {
    const {email, otp} = request.body;
    const user = await UserModel.findOne({email:email});

    if(!user){
      return response.status(400).json({
        message:"user not found",
        error:true,
        success:false
      })
    }
    
    const isCodeValid= user.otp===otp;
    const isNotExpired = user.otpExpires > Date.now();

    if(isCodeValid && isNotExpired){
      user.verify_email = true,
      user.otp=null;
      user.otpExpires=null;
      await user.save();
      return response.status(200).json({success:true, message:"Email verified successfully"})
    }else if(!isCodeValid){
      return response.status(400).json({success:false,message:"Invalid OTP"})
    }else{
      return response.status(400).json({success:false, message:"OTP expired"})
    }

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

export async function loginUserController(request, response){
  try {
    const {email, password}= request.body;
    const user = await UserModel.findOne({email:email});
    if(!user){
      return response.status(400).json({
        message:"user not found",
        error:true,
        success:false
      })
    }

    if(user.status !== "Active"){
      response.status(400).json({
        message:"contact to admin",
        error:true,
        success:false
      })
    }

    const checkPassword = await bcryptjs.compare(password, user.password)
    if(!checkPassword){
       response.status(400).json({
        message:"check your password",
        error:true,
        success:false
      })
    }

    const accessToken= await generatedAccessToken(user._id);
    const refreshToken= await generatedRefreshToken(user._id);
    
    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date:new Date(),
    })

    const cookiesOption={
      httpOnly:true,
      secure:true,
      sameSite:"None"
    }
   response.cookie("accessToken", accessToken,cookiesOption);
   response.cookie("refreshToken", refreshToken,cookiesOption);
   
   return response.json({
    message:"Login successfully",
    error: false,
    success: true,
    data:{
      accessToken,
      refreshToken,
    }
   })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}