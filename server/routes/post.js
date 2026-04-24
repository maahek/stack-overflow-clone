import express from "express";
import { createPost, getPosts, likePost, commentPost, sharePost } from "../controller/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();
import upload from "../middleware/upload.js";

router.post("/create-post",auth, upload.single("media"), createPost); // route to create a post (authentication required and media upload)
router.get("/", getPosts);  // route to get all posts (authentication not required)
router.patch("/like/:id", auth, likePost); // route to like a post by id (authentication required)
router.post("/comment/:id", auth, commentPost); // route to comment on a post by id (authentication required)
router.patch("/share/:id", auth, sharePost); // route to share a post by id (authentication required)

export default router;
