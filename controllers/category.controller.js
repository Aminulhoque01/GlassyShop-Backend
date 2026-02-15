
import CategoryModel from "../models/category.model";


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


export async function categoryImageController(request, response) {
  try {
    const userId = request.userId;

    const user = await CategoryModel.findById(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    /* -------------------------
       DELETE OLD IMAGE FIRST
    --------------------------*/
    if (user.avatar) {
      const parts = user.avatar.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = fileName.split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    /* -------------------------
       UPLOAD NEW IMAGE
    --------------------------*/
    const file = request.files[0];

    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    fs.unlinkSync(file.path);

    user.avatar = result.secure_url;
    await user.save();

    return response.status(200).json({
      _id: userId,
      avatar: result.secure_url,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}
