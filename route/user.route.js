import { Router } from "express";
import { loginUserController, logoutController, registerUserController, removeImageFromCloudinary, updateUserDetails, userAvatarController, verifyEmailController } from "../controllers/user.controller.js";
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

export default userRouter;