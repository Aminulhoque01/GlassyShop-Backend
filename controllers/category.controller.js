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

export async function categoryCreateController(request, response) {
  try {

   let imagesArr = [];
  const images = request.files;

   const options={
    use_filename:true,
    unique_filename:false,
    overwrite:false,
   }
   
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i].path, options,
        function (error, result){
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`)
        }
      );

      
    };

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

    return response.status(200).json({
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
     return response.status(200).json({
       
      error: false,
      success: true,
      data:rootCategories,
    })


  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    })
  }
}

export async function getCategoryCount(request, response){
  try {
    const categories= await CategoryModel.findOne({id:undefined})
    if(!categories){
      res.status(500).json({success:false})
    }else{
      const subCatArr=[];
      for(let cat of categories){
        if(cat.parentId !== undefined){
          subCatArr.push(cat)
        }
      }

      response.send({
        categoryCount: subCatArr,
      })
    }

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    })
  }
}


export async function getSubCategoryCount(request, response){
  try {
    const categories= await CategoryModel.find();
    if(!categories){
      res.status(500).json({success:false})
    }else{
      const subCatArr=[];
      for(let cat of categories){
        if(cat.parentId !== undefined){
          subCatArr.push(cat)
        }
      }

      response.send({
        categoryCount: subCatArr,
      })
    }

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    })
  }
}



export async function getSingleCategory(request, response){
  try {
    const id = request.params.id;
    const single= await CategoryModel.findOne(id);
    if(!single){
      return response.json(500).json({
         message:"single category not found",
          error: true,
          success: false,
      })
    }
   
    return response.json(200).json({
         message:"single category",
          error: true,
          success:  true,
          data: single
    })
    

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    })
  }
}


export async function getSingleCategory(request, response) {
  try {
    const id = request.params.id;

    const single = await CategoryModel.findById(id);

    if (!single) {
      return response.status(404).json({
        message: "Single category not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Single category fetched successfully",
      error: false,
      success: true,
      data: single,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}