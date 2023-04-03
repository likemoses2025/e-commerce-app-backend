import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { sendToken } from "../utils/features.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect Email or Password" });
  }

  // Handle Error
  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Password or Email !!", 400));
  }
  sendToken(user, res, `Welcome Back ${user.name}`, 200);
});

export const signup = asyncError(async (req, res, next) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  let user = await User.findOne({ email });
  console.log(user);

  if (user) return next(new ErrorHandler("User Already Exist", 400));

  // Add Cloudinary Here

  user = await User.create({
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
  });

  sendToken(user, res, `Registered Successfully`, 201);
});
