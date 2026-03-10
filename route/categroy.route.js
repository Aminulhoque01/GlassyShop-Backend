import { Router } from "express";
import { categoryImageController, createCategory, getAllCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/image-upload", categoryImageController);
categoryRouter.post("/create", createCategory);
categoryRouter.post("/all", getAllCategory);

export default categoryRouter;