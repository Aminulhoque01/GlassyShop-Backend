import { request, response } from "express";
import AddressModel from "../models/address.model";

export const addAddressController = async (request, response) => {
  try {

    const userId= request.userId;
    const {
      address_line,
      city,
      state,
      pinCode,
      country,
      mobile,
      status,
       
    } = request.body;

    if (
      address_line ||
      city ||
      state ||
      pinCode ||
      country ||
      mobile 
       
    ) {
      return response.status(500).json({
      message:"Please provide all the fields",
      error: true,
      success: false,
    });
    }
   
    const address= new AddressModel.find({
      address_line,
      city,
      state,
      pinCode,
      country,
      mobile,
      status,
      userId
    })
    const saveAddress= await address.save();

    const updateCartUser= await UserModel.updateOne({_id:userId},{
      $push:{
        address_details: saveAddress?._id,
      }
    });

    return response.status(200).json({
      data:saveAddress,
      message:"address save successfully",
      error:false,
      success:true,
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
