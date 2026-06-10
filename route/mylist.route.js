import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToMyListController, getMyListController } from "../controllers/myList.controller.js";


 const myListRoute= Router();

 myListRoute.post("/add-my-list", auth, addToMyListController)
 myListRoute.get("/get-my-list", auth, getMyListController)

 export default myListRoute;