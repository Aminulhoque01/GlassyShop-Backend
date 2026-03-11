import { Router } from "express";
import { categoryImageController, createCategory, getAllCategory } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const categoryRouter = Router();

categoryRouter.post("/image-upload", categoryImageController);
categoryRouter.post("/create", createCategory);
categoryRouter.post("/all", auth, getAllCategory);

export default categoryRouter;