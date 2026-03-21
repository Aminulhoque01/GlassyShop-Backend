import { Router } from "express";
import { categoryCreateController, createCategory, getAllCategory } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const categoryRouter = Router();

categoryRouter.post("/create", upload.array("images", 5), categoryCreateController);
categoryRouter.post("/create-sub", createCategory);
categoryRouter.get("/all", auth, getAllCategory);
categoryRouter.get("/:id", auth, getAllCategory);

export default categoryRouter;