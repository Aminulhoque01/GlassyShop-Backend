

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide name"],
  },
  email: {
    type: String,
    required: [true, "Provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Provide password"],
  },
  avatar: {
    type: String,
    default: "",
  },
  mobile: {
    type: Number,
    default: null,
  },
  access_token:{
     type: String,
    default: "",
  },
  refresh_token: {
    type: String,
    default: "",
  },

  // ✅ FIXED
  verify_email: {
    type: Boolean,
    default: false,
  },

  // ✅ FIXED
  last_login_date: {
    type: Date,
    default: null,
  },

  status: {
    type: String,
    enum: ["Active", "inactive", "suspended"],
    default: "Active",
  },

  address_details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  ],
  shopping_cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartProduct",
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],

  forgot_password_otp: {
    type: String,
    default: null,
  },

  // ✅ FIXED
  forgot_password_expiry: {
    type: Date,
    default: null,
  },

  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },

  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
