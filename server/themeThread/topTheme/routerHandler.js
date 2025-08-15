import { auth } from "../../middleware.js";
import { topTheme } from "./topTheme.js";
import express from "express";

const router = express.Router();

router.get("/topThemePosts", auth, async (req, res) => {
  try {
    const result = await topTheme(req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting the top theme posts." });
  }
});

export default router;
