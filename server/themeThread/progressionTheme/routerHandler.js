import { auth } from "../../middleware.js";
import express from "express";
import { getProgression } from "./getProgression.js";

const router = express.Router();

router.get("/themeProgression", auth, async (req, res) => {
  try {
    const { theme } = req.query;
    const result = await getProgression(theme, req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting the top theme posts." });
  }
});

export default router;
