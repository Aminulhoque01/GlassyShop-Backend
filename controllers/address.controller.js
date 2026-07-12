import { request, response } from "express";


export const addAddressController= async(request, response)=>{
    try {
        
    } catch (error) {
        return response.json({
              message: "address not successfully",
              success: true,
              error: false,
            });
    }
}