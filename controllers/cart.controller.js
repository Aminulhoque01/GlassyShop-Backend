import { request, response } from "express";
import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.body;

    if (!productId) {
      return response.status(402).json({
        message: "Provide ProductId",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Item already in cart",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      },
    );

    return response.json({
      data: save,
      message: "Item add successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const cartItem = await CartProductModel.find({
      userId: userId,
    }) 
      
    return response.status(200).json({
      data: cartItem,
      error: false,
      success: true,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, qty } = request.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: "provide _id, qty",
      });
    }

    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      },
    );

    return response.status(200).json({
      message: "Update cart",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

// export const deleteItemQtyController = async (request, response) => {
//   try {
//    const userId= request.userId
//    const {_id, productId} = request.body
   
//    if(!_id){
//         return response.status(400).json({
//             message:"Provide _id",
//             error:true,
//             success:false,
//         })
//    }
   
//    const deleteCartItem= await CartProductModel.deleteOne({_id:_id, userId:userId})
    
//     if(!deleteCartItem){
//      return response.status(404).json({
//       message:"Item remove",
//       error:true,
//       success:false,
       
//      })
//     }

//     const user = await UserModel.find({_id:userId});
//     const cartItem= user?.shopping_cart;

//     const updatedUserCart= [...cartItem.slice(0, cartItems.indexOf(productId)), ... cartItem.slice(cartItem.indexOf(productId) +1)]
//     user.shopping_cart = updatedUserCart;

//     await user.save();
  
//   return response.json({
//    message:"Item remove successfully",
//    error:false,
//    success:true,
//    data:deleteCartItem
//   })

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message,
//       error: true,
//       success: false,
//     });
//   }
// };


export const deleteItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, productId } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        success: false,
        error: true,
      });
    }

    // 1. DELETE FROM CART COLLECTION (DATABASE DELETE)
    const deletedCartItem = await CartProductModel.findOneAndDelete({
      _id,
      userId,
    });

    if (!deletedCartItem) {
      return response.status(404).json({
        message: "Item not found",
        success: false,
        error: true,
      });
    }

    // 2. REMOVE FROM USER shopping_cart ARRAY
    await UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          shopping_cart: productId,
        },
      }
    );

    return response.json({
      message: "Item removed successfully",
      success: true,
      error: false,
      data: deletedCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};