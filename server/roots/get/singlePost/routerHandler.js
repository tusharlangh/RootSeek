import { singlePost } from "./singlePost.js";
import express from "express";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await singlePost(id);
    if (!post)
      return res.status(404).json({ message: "The root does not exist." });
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
