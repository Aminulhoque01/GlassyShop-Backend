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


export async function removeImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.image;

    if (!imgUrl) {
      return response.status(400).json({
        message: "Image URL required",
        error: true,
      });
    }

    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const publicId = image.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    return response.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

 

export async function deleteCategory(request, response){
  try {
    const category = CategoryModel.findById(request.params.id)
    const images = category.images;

    for(img of images){
      const imgUrl=img;
      const urlArr=imgUrl.split("/");
      const image = urlArr[urlArr.length-1];

      const imageName= image.split(".")[0];
      if(imageName){
         cloudinary.uploader.destroy(imageName,(error, result)=>{
          console.log(error, result)
        })
      }
      
      const subCategory= await CategoryModel.find({parentId:req.params.id})

      for(let i =0; i<subCategory.length;i++){
        console.log(subCategory[i]._id);
      }

      const thirdsubCategory=await CategoryModel.find({
        parentId:subCategory[i]._id
      });

      for(let i =0; i<thirdsubCategory.length;i++){
        const deletedThirdSubCat= await CategoryModel.findByIdAndDelete(thirdsubCategory[i]._id);
      }

      const deletedSubCat=await CategoryModel.findByIdAndDelete(subCategory[i]._id)

      if(!deletedSubCat){
        response.status(404).json({
          message:"Category not found",
          success:false
        })
      }


      response.status(200).json({
        success:true,
        message:"Category Deleted!",
        success:true
      })

    }
  } catch (error) {
    return response.status(500).json({
      message: "Category deleted!",
      error: false,
      success: true,
    });
  }
}


export async function updatedCategory(request, response){
  try {
     const category= await CategoryModel.findByIdAndUpdate(
      request.params.id,
     {
      name:request.body.name,
      images:request.body.image,
      color:request.body.color,
      parentId:request.body.parentId,
      parentCatName:request.body.parentCatName
     },
     {new:true}
     );

     if(!category){
      return response.status(500).json({
        message:"Category cannot be updated!",
        success:false,
        error:true
      })


     }

     imagesArr=[];

     response.status(200).json({
      message:"category updated",
      error:false,
      success:true,
      category:category,
      
     })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}