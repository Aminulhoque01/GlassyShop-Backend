import { Router } from "express";
import { addToCartItemController, deleteItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

 

 const cartRoute= Router()

 cartRoute.post("/add-product", auth, addToCartItemController);
 cartRoute.get("/cart", auth, getCartItemController);
 cartRoute.put("/update", auth, updateCartItemQtyController);
 cartRoute.delete("/delete-cart-item", auth, deleteItemQtyController);

 export default cartRoute;