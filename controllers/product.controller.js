import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ProductModel from "../models/product.model.js";
import { error } from "console";


cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});





export async function uploadImages(request, response) {
  try {
    const imagesArr = [];

    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    for (const file of request.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(result.secure_url);

      // Local file delete
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    return response.status(200).json({
      success: true,
      images: imagesArr,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export  async function createProduct(request, response){
  try {
    let product = new ProductModel({
       name: request.body.name,
       description: request.body.description,
       images:request.body.images,
       brand: request.body.brand,
       price: request.body.price,
       oldPrice: request.body.oldPrice,
       catName: request.body.catName,
        
       catId: request.body.catId,
       subCatId: request.body.subCatId,
       subCat: request.body.subCat,
       subCatName: request.body.subCatName,
       thirdsubCat: request.body.thirdsubCat,
       thirdsubCatName: request.body.thirdsubCatName,
       countInStock: request.body.countInStock,
       rating: request.body.rating,
       isFeatured: request.body.isFeatured,
       discount: request.body.discount,
       productRam: request.body.productRam,
       size: request.body.size,
       productWeight: request.body.productWeight,
      })
      product = await product.save();

      if(!product){
        response.status(500).json({
          error:true,
          success:false,
          message:"product not created"
        })
      }
 

      response.status(200).json({
        message:"product created successfully",
        error:false,
        success:true,
      })

  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}

export async function getAllProduct(request, response){
  try {
    const products = await ProductModel.find();
    if(!products){
      response.status(500).json({
        error:true,
        success:false
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      data:products,
    })
  } catch (error) {
     return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}