import express from "express";
import {
  changePassword,
  getMyProfile,
  logOut,
  login,
  signup,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Auth Routes
router.post("/login", login);

router.post("/new", signup);

router.get("/me", isAuthenticated, getMyProfile);

// Profile Route
router.get("/logout", isAuthenticated, logOut);

// Update Routes
router.put("/updateProfile", isAuthenticated, updateProfile);

router.put("/changepassword", isAuthenticated, changePassword);

export default router;
