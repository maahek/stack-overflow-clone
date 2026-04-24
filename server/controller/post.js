import Post from "../models/post.js";
import User from "../models/auth.js";

export const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const userId = req.userId;
    const mediaPath = req.file?.path;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followerCount = user.followers.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postsToday = await Post.countDocuments({
      author: userId,
      createdAt: { $gte: today },
    });

    if (followerCount === 0) {
      return res
        .status(403)
        .json({ message: "You must have at least 1 follower to create a post." });
    }

    if (followerCount === 1 && postsToday >= 1) {
      return res
        .status(403)
        .json({ message: "You can only create 1 post per day with 1 follower." });
    }

    if (followerCount === 2 && postsToday >= 2) {
      return res.status(403).json({
        message: "You can only create 2 posts per day with 2 followers.",
      });
    }

    // No limit for users with 10 or more followers (optional rule)
    const newPost = await Post.create({
      author: userId,
      content,
      media: mediaPath,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.userId;
    if (!userId){
      return res.status(401).json("Unauthorized");
    }
    if (!post.likes) post.likes = [];
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error)
    res.status(500).json("Server Error");
  }
};

export const commentPost = async (req, res) => {

  try {
    const { id } = req.params;
  const { text } = req.body;
  const userId = req.userId;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    const updated = await Post.findById(id).populate("author", "name").populate("comments.user", "name");
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sharePost = async (req, res) => {
 try {
  const { id } = req.params;
  const post = await Post.findById(id);

  if(!post) return res.status(404).json({ message: "Post not found" });

  post.shares = (post.shares || 0) + 1;
  await post.save();
  res.json(post);
 } catch (error) {
  res.status(500).json({ message: "Server Error" });
 }
};
