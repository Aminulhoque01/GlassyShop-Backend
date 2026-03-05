import { Router } from "express";
import { categoryImageController, createCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/image-upload", categoryImageController);
categoryRouter.post("/create", createCategory);

export default categoryRouter;