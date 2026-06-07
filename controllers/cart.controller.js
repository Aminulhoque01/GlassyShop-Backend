import { request, response } from "express";



export const addToCartItemController= async(request, response)=>{
    try {
        const userId=request.userId;
        const {productId}= request.body;

        if(!productId){
            return response.status(402).json({
                message:"Provide ProductId",
                error:true,
                success:false
            })
        }
    } catch (error) {
        return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
    }
}