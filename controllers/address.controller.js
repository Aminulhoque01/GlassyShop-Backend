import { response } from "express";
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;

    const { address_line1, city, state, pinCode, country, mobile, status } =
      request.body;

    console.log("userId =", userId);
    console.log("body =", request.body);
    if (!address_line1 || !city || !state || !pinCode || !country || !mobile) {
      return response.status(400).json({
        message: "Please provide all fields",
        success: false,
        error: true,
      });
    }

    const address = new AddressModel({
      address_line1,
      city,
      state,
      pinCode,
      country,
      mobile,
      status,
      userId,
    });

    const saveAddress = await address.save();

    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          address_details: saveAddress._id,
        },
      },
    );

    return response.status(201).json({
      data: saveAddress,
      message: "Address saved successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);

    return response.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const getAddress = async (request, response) => {
  try {
    const address = await AddressModel.find({ userId: request?.query?.userId });
    if (!address) {
      return response.status({
        error: true,
        success: false,
        message: "address not found",
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      data: address,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const selectAddressController = async (request, response) => {
  try {
    const userId = request.params._id;

    const address = await AddressModel.find({
      userId: request.params.id,
    });

    if (!address) {
      return response.status(500).json({
        message: error.message,
        success: false,
        error: true,
      });
    }else{
      return response.status(500).json({
        
        success: true,
        error: false,
        data:address
      });
    }


  } catch (error) {
    return response.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
