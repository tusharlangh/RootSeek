import { auth } from "../../middleware.js";
import { analyzeThemeProgression } from "./analyzeThemeProgression.js";
import express from "express";

const router = express.Router();

router.get("/analyzeThemeProgression", auth, async (req, res) => {
  try {
    const { posts, theme } = req.body;
    const result = await analyzeThemeProgression(posts, theme, req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting the top theme posts." });
  }
});

export default router;
