import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


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