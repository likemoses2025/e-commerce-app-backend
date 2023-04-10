import { asyncError } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProducts = asyncError(async (req, res, next) => {
  // Search & Category query
  const products = await Product.find({});

  res.status(200).json({ success: true, products });
});

export const getAdminProduct = asyncError(async (req, res, next) => {
  // Search & Category query
  const products = await Product.find({});

  res.status(200).json({ success: true, products });
});

export const getProductDetails = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({ success: true, product });
});

export const createProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;

  if (!req.file) return next(new ErrorHandler("Please Add Image", 400));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = { public_id: myCloud.public_id, url: myCloud.secure_url };

  await Product.create({
    name,
    description,
    category,
    price,
    stock,
    images: [image],
  });

  res
    .status(200)
    .json({ success: true, message: "Product Created Successfully" });
});

export const updateProduct = asyncError(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  await product.save();

  res
    .status(200)
    .json({ success: true, message: "Product Updated Successfully", product });
});

export const addProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 400));
  if (!req.file) return next(new ErrorHandler("Please Add Image", 404));

  const file = getDataUri(req.file);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);
  const image = { public_id: myCloud.public_id, url: myCloud.secure_url };

  product.images.push(image);
  await product.save();

  res.status(200).json({ success: true, message: "Image Added Successfully" });
});

export const deleteProductImage = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 400));

  console.log("Query", req.query);
  const id = req.query.id;
  if (!id) return next(new ErrorHandler("Image Id not found", 400));

  let isExist = -1;
  product.images.forEach((item, index) => {
    if (item._id.toString() === id.toString()) isExist = index;
  });

  // Image doesn't exist
  if (isExist < -1) return next(new ErrorHandler("Image dose not exist", 400));

  await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

  product.images.splice(isExist, 1);

  await product.save();

  res
    .status(200)
    .json({ success: true, message: "Image deleted Successfully" });
});

export const deleteProduct = asyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(product);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // cloudinary image delete
  for (let index = 0; index < product.images.length; index++) {
    await cloudinary.v2.uploader.destroy(product.images[index].public_id);
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
