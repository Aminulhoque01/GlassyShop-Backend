import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, getAddress } from "../controllers/address.controller.js";

 const addressRoute= Router();

 addressRoute.post("/add", auth,addAddressController);
 addressRoute.get("/", auth,getAddress);

 export default addressRoute;

