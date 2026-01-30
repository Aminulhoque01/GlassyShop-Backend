import { Router } from "express";
import { registerUserController, verifyEmailController } from "../controllers/user.controller.js";


const userRouter= Router();

userRouter.post('/register', registerUserController);
userRouter.post("/verify", verifyEmailController)

export default userRouter;