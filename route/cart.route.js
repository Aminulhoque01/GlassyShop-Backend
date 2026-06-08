import { Router } from "express";
import { addToCartItemController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

 

 const cartRoute= Router()

 cartRoute.post("/add-product", auth, addToCartItemController);
 cartRoute.get("/cart", auth, getCartItemController);
 cartRoute.put("/update", auth, updateCartItemQtyController);

 export default cartRoute;