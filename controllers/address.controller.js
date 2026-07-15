import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;

    const {
      address_line1,
      city,
      state,
      pinCode,
      country,
      mobile,
      status,
    } = request.body;

    console.log("userId =", userId);
    console.log("body =", request.body);
    if (
      !address_line1 ||
      !city ||
      !state ||
      !pinCode ||
      !country ||
      !mobile
    ) {
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
      }
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