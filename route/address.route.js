import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, getAddress, selectAddressController } from "../controllers/address.controller.js";

 const addressRoute= Router();

 addressRoute.post("/add", auth,addAddressController);
 addressRoute.get("/get-address", auth,getAddress);
 addressRoute.put("/:id", auth, selectAddressController);

 export default addressRoute;

