import express from "express";
import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  followUser,
  getUserProfile,
  forgotPassword,
  userProfile,
 
} from "../controller/auth.js";

const router = express.Router();
import auth from "../middleware/auth.js";
router.post("/signup", Signup);
router.post("/login", Login);   
router.get("/getalluser", getallusers);
router.patch("/update/:id",auth, updateprofile);
router.patch("/follow/:id", auth, followUser); // route to follow a user by id (authentication required)
router.get("/profile", auth, userProfile); // route to get user profile (authentication required)
router.get("/:id", auth, getUserProfile); // route to get user profile by id (authentication required)
router.post("/forgot-password", forgotPassword); // route to forgot password



export default router;
