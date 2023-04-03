import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: [true, "Email already exists"],
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [6, "Password must be at least 6 characters long"],
    // 사용자 정보를 요청할때 제외됨.
    select: false,
  },

  address: {
    type: String,
    required: [true, "Please Enter Address"],
  },

  city: {
    type: String,
    required: [true, "Please Enter City"],
  },

  country: {
    type: String,
    required: [true, "Please Enter Country"],
  },

  pinCode: {
    type: Number,
    required: [true, "Please Enter PinCode"],
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  avatar: {
    public_id: String,
    url: String,
  },

  otp: Number,
  otp_expires: Date,
});

schema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

export const User = mongoose.model("User", schema);
