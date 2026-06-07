import { Router } from "express";
import { addToCartItemController } from "../controllers/cart.controller";

 

 const cartRoute= Router()

 cartRoute.post("/add", addToCartItemController);

 export default cartRoute;