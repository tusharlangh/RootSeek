import Post from "../models/post-model.js";
import express from "express";
import { auth } from "../middleware.js";
import { growthTrace } from "./growthTrace.js";

const router = express.Router();

router.get("/identify/growth-trace", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });

    const result = await growthTrace(posts);

    return res.json({ trace: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
