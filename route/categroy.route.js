import { Router } from "express";
import { categoryImageController } from "../controllers/category.controller";


const categoryRouter= Router();

 categoryRouter.post("/image-upload", categoryImageController)


export default categoryRouter;