import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ProductModel from "../models/product.model";
import { error } from "console";


cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});


var imagesArr = [];

export async function uploadImages(request, response) {
  try {
    imagesArr=[];
    const image= request.files;

    const options={
      use_filename:true,
      unique_filename:false,
      overwrite:false,
    }

    for(let i=0; i<image?.length; i++){
      const img= await cloudinary.uploader.upload(
        image[i].path,
        function(error,result){
          imagesArr.push(request.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`)
          
        }
      )
    }

    return response.status(200).json({
      images:imagesArr
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error:true,
      success:false
    })
  }
}


export  async function createProduct(request, response){
  try {
    const product = new ProductModel({
       name: request.body.name,
       description: request.body.description,
       images:imagesArr,
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
      product = await ProductModel.save();

      if(!product){
        response.status(500).json({
          error:true,
          success:false,
          message:"product not created"
        })
      }

      imagesArr=[];

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