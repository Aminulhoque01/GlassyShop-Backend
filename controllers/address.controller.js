import { request, response } from "express";

export const addAddressController = async (request, response) => {
  try {
    const {
      address_line,
      city,
      state,
      pinCode,
      country,
      mobile,
      status,
      userId,
    } = request.body;

    if (
      address_line ||
      city ||
      state ||
      pinCode ||
      country ||
      mobile ||
      userId
    ) {
      return response.status(500).json({
      message:"Please provide all the fields",
      error: true,
      success: false,
    });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
