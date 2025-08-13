import { auth } from "../../../middleware.js";
import { twentyFourPosts } from "./twentyFourPosts.js";
import express from "express";

const router = express.Router();

router.get("/twenty-four-h-posts", auth, async (req, res) => {
  try {
    const userPosts = await twentyFourPosts(req.userId);

    if (!userPosts)
      return res.status(400).json({ message: "No posts found for this user." });
    res.json(userPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

export default router;
