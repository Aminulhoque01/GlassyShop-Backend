import { Router } from "express";
import auth from "../middleware/auth";
import { addToMyListController } from "../controllers/myList.controller";


 const myListRoute= Router();

 myListRoute.post("/add-my-list", auth, addToMyListController)

 export default myListRoute;