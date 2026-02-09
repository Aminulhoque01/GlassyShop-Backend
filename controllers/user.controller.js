import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/emailService.js";
import VerificationEmail from "../helper/sendVerificationEmail.js";
import UserModel from "../models/user.model.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import { request } from "express";

import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import sendEmailFun from "../config/sendEmail.js";

cloudinary.config({
  cloud_name:process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret:process.env.cloudinary_Config_api_secret,
  secure:true,
})

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

    if(user.verify_email !== true){
      response.status(400).json({
        message:"Your Email is not verify yet please verify your email first",
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
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}


export async function logoutController(request, response){
  try {
     const userid= request.userId
     const cookiesOption={
      httpOnly: true,
      secure:true,
      sameSite: "None"
     }

     response.clearCookie("accessToken", cookiesOption);
     response.clearCookie("refreshToken", cookiesOption);

     const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
      refresh_token:""
     })

     return response.json({
      message:"Logout successfully",
      error:false,
      success:true,
     })

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }

}




 
// export async function userAvatarController(request, response) {
//   try {
//     const userId = request.userId;
//     const imagesArr = [];
    
//     const user = await UserModel.findOne({_id:userId});
//     const urlArr = user.avatar;
//     const image = urlArr[urlArr.length-1];

//     const imageName = image.split(".")[0];

//     if(imageName){
//       const res= await cloudinary.uploader.destroy(
//         imageName,
//         (error, result)=>{
//           console.log(error, res);
//         }
//       );

//       if(res){
//         response.status(200).send(res)
//       }
//     }

//     if(!user){
//       return response.status(500).json({
//         message:"User not found",
//         error:true,
//         success:false,
//       })
//     }

//     for (let i = 0; i < request.files.length; i++) {
//       const file = request.files[i];

//       const result = await cloudinary.uploader.upload(file.path, {
//         use_filename: true,
//         unique_filename: true,
//         overwrite: false,
//       });

//       imagesArr.push(result.secure_url);

//       fs.unlinkSync(file.path);  
//     }
//     user.avatar= imagesArr[0];
//     await user.save();

//     return response.status(200).json({
//       _id: userId,
//       avatar: imagesArr[0],
//     });

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message,
//       error: true,
//       success: false,
//     });
//   }
// }


export async function userAvatarController(request, response) {
  try {
    const userId = request.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    /* -------------------------
       DELETE OLD IMAGE FIRST
    --------------------------*/
    if (user.avatar) {
      const parts = user.avatar.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = fileName.split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    /* -------------------------
       UPLOAD NEW IMAGE
    --------------------------*/
    const file = request.files[0];

    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    fs.unlinkSync(file.path);

    user.avatar = result.secure_url;
    await user.save();

    return response.status(200).json({
      _id: userId,
      avatar: result.secure_url,
      success: true,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}




export async function removeImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.image;

    if (!imgUrl) {
      return response.status(400).json({
        message: "Image URL required",
        error: true,
      });
    }

    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const publicId = image.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    return response.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}


export async function updateUserDetails(request, response){
  try {
    const userId = request.userId // auth.middleware
    const {name, email, mobile,password}= request.body;
    const userExist = await UserModel.findById(userId);

    let verifyCode="";

    if(email){
      verifyCode = Math.floor(100000 + Math.random()*900000).toString();
    }

    let hashPassword = ""

    if(password){
      const salt = await bcryptjs.genSalt(10)
      hashPassword = await bcryptjs.hash(password, salt)
    }else{
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId,{
      name:name,
      mobile:mobile,
      email:email,
      verify_email: email ? false : true,
      password:hashPassword,
      otp: verifyCode !== " "? verifyCode:null,
      otpExpires:verifyCode !==""?Date.now()+600000:""
    }, {
      new: true,
    })

    if(!userExist){
      return res.status(400).send('The user cannot be updated!')
    }

    return response.json({
      message: "User Updated successfully",
      error:false,
      success: true,
      user: updateUser,
    });


  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}


// export async function forgotPassword(request, response){
//   try {
    
//     const {email} = request.body;
//     const user = await UserModel.findOne({email:email});
//     if(!user){
//       return response.status(400).json({
//         message:"Email not available",
//         error:true,
//         success:true,
//       })
//     };

//     let verifyCode=  Math.floor(100000 + Math.random()*900000).toString();
     
//     const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
       
//       otp: verifyCode !== " "? verifyCode:null,
//       otpExpires:verifyCode !==""?Date.now()+600000:""
//     }, {
//       new: true,
//     })

     
   

//     await sendEmail({
//       sendTo:email,
//       subject: "Verify email from Ecommerce APP",
//       text:'',
//       html:VerificationEmail(user?.name,verifyCode)
//     });
    
//     return response.json({
//       message:"Check your email",
//       error:false,
//       success:true,
//     })

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message,
//       error: true,
//       success: false,
//     });
//   }
// }



export async function forgotPassword(request, response) {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    await UserModel.findByIdAndUpdate(user._id, {
      otp: verifyCode,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    

      await sendEmail(
      email,
      "Password Reset OTP",
      "",
      VerificationEmail(user.name, verifyCode),
    );

    return response.json({
      message: "Check your email for OTP",
      success: true,
      error: false,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}
