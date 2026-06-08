import { Router } from "express";
import { addToCartItemController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

 

 const cartRoute= Router()

 cartRoute.post("/add-product", auth, addToCartItemController);

 export default cartRoute;