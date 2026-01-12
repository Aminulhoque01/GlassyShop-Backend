import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/emailService.js";
import VerificationEmail from "../helper/sendVerificationEmail.js";
import UserModel from "../models/user.model.js";

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
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
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await sendEmail({
      sendTo: email,
      subject: "Verify email from E-commerce App",
      text: "",
      html: VerificationEmail(name, verifyCode),
    });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return response.status(201).json({
      success: true,
      error: false,
      message: "User registered successfully! Please verify your email.",
      token,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}
