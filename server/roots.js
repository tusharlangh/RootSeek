import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

const postScheme = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    mood: { type: String },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postScheme);

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable for secret
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

// Get all posts for a user
router.get("/user/posts", auth, async (req, res) => {
  try {
    const userPosts = await Post.find({ user: req.userId });
    if (!userPosts || userPosts.length === 0)
      return res.status(400).json({ message: "No posts found for this user." });
    res.json(userPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

// Create a new post for a user
router.post("/user/create", auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const post = new Post({
      user: req.userId,
      title,
      content,
      date: Date.now(), 
      mood,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating post." });
  }
});

export default router;
