import { sendEmail } from "../config/emailService.js";
import VerificationEmail from "../helper/sendVerificationEmail.js";
import UserModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    }

   
    if (user) {
      return response.json({
        message: "User already Register with this email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

   
    user = await UserModel.findOne({
      name: name,
      email: email,
      password: hashPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 600000,
    });

    await user.save();

    //send verifyCation email
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from E-commerce App",
      html: VerificationEmail(name, verifyCode),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
