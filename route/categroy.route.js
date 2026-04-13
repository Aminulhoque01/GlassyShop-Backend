import { Router } from "express";
import { categoryCreateController, createCategory, deleteCategory, getAllCategory, getCategoryCount, getSingleCategory, getSubCategoryCount, removeImageFromCloudinary } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const categoryRouter = Router();

categoryRouter.post("/create", upload.array("images", 5), categoryCreateController);
categoryRouter.post("/create-sub", createCategory);
categoryRouter.get("/all", auth, getAllCategory);
categoryRouter.get("/category-count", auth, getCategoryCount);
categoryRouter.get("/sub-category-count", auth, getSubCategoryCount);
categoryRouter.get("/:id", auth, getSingleCategory);
categoryRouter.get("/:id", getSingleCategory);
categoryRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
categoryRouter.delete("/:id", auth, deleteCategory);

export default categoryRouter;