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

 

export async function getAllProduct(request, response) {
  try {
    // Query Params
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const search = request.query.search || "";
    const catId = request.query.catId || "";
    const subCatId = request.query.subCatId || "";
    const brand = request.query.brand || "";
    const minPrice = Number(request.query.minPrice) || 0;
    const maxPrice = Number(request.query.maxPrice) || 999999999;
    const sort = request.query.sort || "newest";

    const skip = (page - 1) * limit;

    // Filter Object
    let filter = {};

    // Search by name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Category Filter
    if (catId) {
      filter.catId = catId;
    }

    // Sub Category Filter
    if (subCatId) {
      filter.subCatId = subCatId;
    }

    // Brand Filter
    if (brand) {
      filter.brand = {
        $regex: brand,
        $options: "i",
      };
    }

    // Price Filter
    filter.price = {
      $gte: minPrice,
      $lte: maxPrice,
    };

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = { price: 1 };
        break;

      case "priceHigh":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await ProductModel.countDocuments(filter);

    const products = await ProductModel.find(filter).populate('category')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return response.status(200).json({
      success: true,
      error: false,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
}


export async function getAllProductByCatId(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({catId:request.params.id}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}


export async function getAllProductByCatName(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({catName:request.query.catName}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}


export async function getAllProductBySubCatId(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({subCatId:request.params.id}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}


export async function getAllProductBySubCatName(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({subCatName:request.query.subCatName}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}

export async function getAllProductBythirdsubCat(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({thirdsubCat:request.query.thirdsubCat}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}


export async function getAllProductBythirdsubCatName(request, response){
  try {
    const page= parseInt(request.query.page)||1;
    const perPage = parseInt(request.query.perPage)||10000;
    
    const totalPosts= await ProductModel.countDocuments();
    const totalPages= Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message:"Page not found",
        success:false,
        error:true,
      })
    }


    const products = await ProductModel.find({thirdsubCatName:request.query.thirdsubCatName}).populate("category")
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    if(!products){
      response.status(500).json({
        error:true,
        success:false,
      })
    }


    return response.status(200).json({
      error:false,
      success:true,
      products:products,
      totalPages:totalPages,
      page:page,
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message || error,
      error: true,
      success: false,
    })
  }
}




export async function getAllProductByPrice(request, response){
  let productList = [];

  if(request.query.catId !=="" && request.query.catId !== undefined){
    const productListArr = await ProductModel.find({
      catId: req.query.catId,

    }).populate('category')

    productList = productListArr;
    
  }


  
  if(request.query.subCatId !=="" && request.query.subCatId !== undefined){
    const productListArr = await ProductModel.find({
      subCatId: req.query.subCatId,

    }).populate('category')

    productList = productListArr;
    
  }



  if(request.query.thirdsubCat !=="" && request.query.thirdsubCat !== undefined){
    const productListArr = await ProductModel.find({
      thirdsubCat: req.query.thirdsubCat,

    }).populate('category')

    productList = productListArr;
    
  }
}

