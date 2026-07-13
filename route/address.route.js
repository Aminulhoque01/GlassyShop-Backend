import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController } from "../controllers/address.controller.js";

 const addressRoute= Router();

 addressRoute.post("/add", auth,addAddressController);

 export default addressRoute;

