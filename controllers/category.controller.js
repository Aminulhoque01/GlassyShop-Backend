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

export const categoryCreateController = async (req, res) => {
  try {
    const { name, parentId, parentCatName } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
        success: false,
        error: true,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image",
        success: false,
        error: true,
      });
    }

    const imagesArr = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      imagesArr.push(result.secure_url);

      // Local uploaded file delete
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const category = await CategoryModel.create({
      name,
      images: imagesArr,
      parentId: parentId || null,
      parentCatName: parentCatName || "",
    });

    return res.status(201).json({
      message: "Category created successfully",
      success: true,
      error: false,
      category,
    });
  } catch (error) {
    console.error("Category Create Error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export async function createCategory(request, response) {
  try {
    const { name, parentId, parentCatName } = request.body;

    if (!name) {
      return response.status(400).json({
        message: "Category name is required",
        error: true,
        success: false,
      });
    }

    const category = new CategoryModel({
      name,
      images: [],
      parentId: parentId || null,
      parentCatName: parentCatName || "",
    });

    const savedCategory = await category.save();

    return response.status(201).json({
      message: "Category created successfully",
      error: false,
      success: true,
      category: savedCategory,
    });

  } catch (error) {
    console.log("Create category error:", error);

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

 

// export async function deleteCategory(request, response){
//   try {
//     const category = CategoryModel.findById(request.params.id)
//     const images = category.images;

//     for(img of images){
//       const imgUrl=img;
//       const urlArr=imgUrl.split("/");
//       const image = urlArr[urlArr.length-1];

//       const imageName= image.split(".")[0];
//       if(imageName){
//          cloudinary.uploader.destroy(imageName,(error, result)=>{
//           console.log(error, result)
//         })
//       }
      
//       const subCategory= await CategoryModel.find({parentId:request.params.id})

//       for(let i =0; i<subCategory.length;i++){
//         console.log(subCategory[i]._id);
//       }

//       const thirdsubCategory=await CategoryModel.find({
//         parentId:subCategory[i]._id
//       });

//       for(let i =0; i<thirdsubCategory.length;i++){
//         const deletedThirdSubCat= await CategoryModel.findByIdAndDelete(thirdsubCategory[i]._id);
//       }

//       const deletedSubCat=await CategoryModel.findByIdAndDelete(subCategory[i]._id)

//       if(!deletedSubCat){
//         response.status(404).json({
//           message:"Category not found",
//           success:false
//         })
//       }


//       response.status(200).json({
//         success:true,
//         message:"Category Deleted!",
//         success:true
//       })

//     }
//   } catch (error) {
//     return response.status(500).json({
//       message: "Category deleted!",
//       error: false,
//       success: true,
//     });
//   }
// }


export async function deleteCategory(request, response) {
  try {
    const categoryId = request.params.id;

    // 1. Main category find
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Category not found",
      });
    }

    // ==========================================
    // 2. Delete main category images from Cloudinary
    // ==========================================

    if (category.images && category.images.length > 0) {
      for (const imgUrl of category.images) {
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if (imageName) {
          try {
            const result = await cloudinary.uploader.destroy(
              imageName
            );

            console.log("Cloudinary deleted:", result);
          } catch (error) {
            console.log(
              "Cloudinary delete error:",
              error.message
            );
          }
        }
      }
    }

    // ==========================================
    // 3. Find sub categories
    // ==========================================

    const subCategories = await CategoryModel.find({
      parentId: categoryId,
    });

    // ==========================================
    // 4. Delete sub categories + third level
    // ==========================================

    for (const subCategory of subCategories) {
      const subCategoryId = subCategory._id;

      // -----------------------------
      // Find third level categories
      // -----------------------------

      const thirdSubCategories = await CategoryModel.find({
        parentId: subCategoryId,
      });

      // -----------------------------
      // Delete third level
      // -----------------------------

      for (const thirdCategory of thirdSubCategories) {
        await CategoryModel.findByIdAndDelete(
          thirdCategory._id
        );

        console.log(
          "Deleted third category:",
          thirdCategory._id
        );
      }

      // -----------------------------
      // Delete sub category
      // -----------------------------

      await CategoryModel.findByIdAndDelete(
        subCategoryId
      );

      console.log(
        "Deleted sub category:",
        subCategoryId
      );
    }

    // ==========================================
    // 5. Finally delete main category
    // ==========================================

    await CategoryModel.findByIdAndDelete(categoryId);

    // ==========================================
    // 6. Send ONE response
    // ==========================================

    return response.status(200).json({
      success: true,
      error: false,
      message: "Category deleted successfully!",
    });

  } catch (error) {
    console.log("Delete category error:", error);

    return response.status(500).json({
      success: false,
      error: true,
      message: error.message,
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