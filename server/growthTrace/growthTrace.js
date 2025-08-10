import { getPast60DaysPosts, getSequentialData } from "./utility.js";
import Post from "../models/post-model.js";
import express from "express";
import { getAggregatedEmotionalData, getGrowthTrace } from "./fetchTrace.js";
import { auth } from "../middleware.js";

const router = express.Router();

router.get("/identify/growth-trace", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });

    const lastPost = posts[posts.length - 1];

    const past60Days = getPast60DaysPosts(posts, lastPost);

    const moodSequential = getSequentialData(past60Days, lastPost, "mood");
    const toneSequential = getSequentialData(past60Days, lastPost, "tone");
    const intensitySequential = getSequentialData(
      past60Days,
      lastPost,
      "intensity"
    );

    const aggregatedData = await getAggregatedEmotionalData(
      moodSequential,
      toneSequential,
      intensitySequential
    );

    const growthTrace = await getGrowthTrace(lastPost, aggregatedData);

    return res.json({ trace: growthTrace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
