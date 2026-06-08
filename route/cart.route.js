import { Router } from "express";
import { addToCartItemController, getCartItemController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

 

 const cartRoute= Router()

 cartRoute.post("/add-product", auth, addToCartItemController);
 cartRoute.get("/cart", auth, getCartItemController);

 export default cartRoute;