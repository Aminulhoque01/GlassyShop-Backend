import { request } from "express";
import MyListModel from "../models/myList.model.js";

export const addToMyListController = async (request, response) => {
  try {
    const userId = request.userId;
    const {productId,productTitle,image,rating,price,oldPrice,brand,discount}=request.body;

    const item = await MyListModel.findOne({
        userId:userId,
        productId:productId
    });

    if(item){
        return response.status(400).json({
            message:"Item already in my list"
        })
    }
    
    const myList = new MyListModel({
        productId,productTitle,image,rating,price,oldPrice,brand,discount, userId
    });

    const save = await myList.save();

    return response.status(200).json({
        error:false,
        success:true,
        message:"The product added in the my list"
    })
    

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};


export const getMyListController= async(request, response)=>{
  try {
    const userId= request.userId;

    const mylist = await MyListModel.find({ userId: userId,}).populate("productId");

    if(!mylist){
      return response.status(404).json({
        error:true,
        success:false,
        message:"mylist not found"
      });
    }

    return response.json({
      error:false,
      success:true,
      message:"my list product get successfully",
      data: mylist,
    })

  } catch (error) {
     return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}