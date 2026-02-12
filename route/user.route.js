import { Router } from "express";
import { forgotPassword, loginUserController, 
    logoutController, refreshToken, registerUserController, 
    removeImageFromCloudinary, resetPassword, 
    updateUserDetails, userAvatarController, 
    userDetails, 
    verifyEmailController, verifyForgotPasswordOtp } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";


const userRouter= Router();

userRouter.post('/register', registerUserController);
userRouter.post("/verify", verifyEmailController)
userRouter.post("/login", loginUserController)
userRouter.post("/logout", auth, logoutController)
userRouter.put("/user_avatar", auth, upload.array("avatar",5), userAvatarController)
userRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails)
userRouter.post('/forgot-password',  forgotPassword)
userRouter.post('/verify-forgot-password',  verifyForgotPasswordOtp)
userRouter.post('/reset-password',  resetPassword)
userRouter.post('/refresh-token',  refreshToken)
userRouter.get('/user-details', auth, userDetails)

export default userRouter;