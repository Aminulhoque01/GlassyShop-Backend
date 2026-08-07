import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, deleteAddress, getAddress, selectAddressController } from "../controllers/address.controller.js";

 const addressRoute= Router();

 addressRoute.post("/add", auth,addAddressController);
 addressRoute.get("/get-address", auth,getAddress);
 addressRoute.put("/:id", auth, selectAddressController);
 addressRoute.delete("/:id", auth, deleteAddress);

 export default addressRoute;

