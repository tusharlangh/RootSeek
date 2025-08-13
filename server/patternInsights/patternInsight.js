import express from "express";
import dotenv from "dotenv";
import { auth } from "../middleware.js";
import { getInsight } from "./getInsight.js";

dotenv.config();

const router = express.Router();

router.get("/pattern-insights", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const insights = await getInsight(userId);
    res.json(insights);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting pattern insights" });
  }
});

export default router;
