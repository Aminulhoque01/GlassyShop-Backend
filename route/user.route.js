import { Router } from "express";
import { loginUserController, logoutController, registerUserController, verifyEmailController } from "../controllers/user.controller.js";


const userRouter= Router();

userRouter.post('/register', registerUserController);
userRouter.post("/verify", verifyEmailController)
userRouter.post("/login", loginUserController)
userRouter.post("/logout", logoutController)

export default userRouter;