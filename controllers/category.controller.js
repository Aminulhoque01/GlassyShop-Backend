import CategoryModel from "../models/category.model.js";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export async function categoryImageController(request, response) {
  try {
    imagesArr = [];

    const image = request.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };
    

    for(let i=0; i<image?.length; i++){
      image = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function(error, result){
          imagesArr.push(request.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`)
        }
      )
    }
     
    let category = new CategoryModel({
      name: request.body.name,
      images:imagesArr,
      color: request.body.parentId,
      parentId: request.body.parentId,
      parentCatName: request.body.parentCatName,
    });

    if(!category){
      response.status(500).json({
        error:error,
        success:false,
      })
    }

   return response.status(200).json({
    images:imagesArr
   })

    

    
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}


export async function createCategory(request, response){
    try {
      
      let category=new CategoryModel({
        name:request.body.name,
        images:imagesArr,
        parentId:request.body.parentId,
        parentCatName:request.body.parentCatName,
      });

      if(!category){
        return response.status(500).json({
          message:"Category not found",
          error:true,
          success:false
        })
      }

      category=await category.save();
      imagesArr=[];

      response.status(500).json({
        message:"Category not created",
        error:true,
        success:false,
        category:category
      })


    } catch (error) {
      return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
    }
}


export async function getAllCategory(request,response){
  try {
     const categories= await CategoryModel.find();
     const categoryMap={};

     categories.forEach(cat=>{
      categoryMap[cat._id]={...cat._doc, children:[]}
     });

     const rootCategories=[];
     categories.forEach(cat=>{
       
      if(cat.parentId){
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      }else{
        rootCategories.push(categoryMap[cat._id]);
      }
      
     })

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    })
  }
}