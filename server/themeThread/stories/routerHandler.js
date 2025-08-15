import { stories } from "./stories.js";
import { auth } from "../../middleware.js";
import express from "express";

const router = express.Router();

router.post("/stories", auth, async (req, res) => {
  const { posts, theme } = req.body;
  const result = await stories(req.userId, posts, theme);
  res.json(result);
});

export default router;
