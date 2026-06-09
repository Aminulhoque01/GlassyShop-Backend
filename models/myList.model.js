import mongoose from "mongoose";

const myListSchema = new mongoose.Schema({
  productId: {
    type: String,
    required:true,
  },
  userId:{
    type:String,
    required:true
  },
 productTitle:{
  type:String,
  required:true
 },
 image:{
  type:String,
  required:true
 },
 rating:{
  type:Number,
  required:true
 }
  
});
