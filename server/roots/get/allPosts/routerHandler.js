import { auth } from "../../../middleware.js";
import { allPosts } from "./allPosts.js";
import express from "express";

const router = express.Router();

router.get("/all", auth, async (req, res) => {
  const posts = await allPosts(req.userId);

  if (!posts)
    return res.status(400).json({ message: "No posts found for this user." });

  res.json(posts);
});

export default router;
