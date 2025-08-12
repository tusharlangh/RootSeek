import express from "express";
import NlpTasks from "../models/nlptasks.js";
import Post from "../models/post-model.js";
import dotenv from "dotenv";
import { generatePatternInsight } from "./generatePatternInsight.js";
import { auth } from "../middleware.js";
import moment from "moment";

dotenv.config();

const router = express.Router();

router.get("/pattern-insights", auth, async (req, res) => {
  try {
    const userId = req.userId;

    let nlpTasks = await NlpTasks.findOne({ user: userId });
    let lastCreated = moment("2005-11-30");
    if (!nlpTasks) {
      nlpTasks = new NlpTasks({ user: userId });
    } else if (nlpTasks.patternInsights?.date) {
      lastCreated = moment(nlpTasks.patternInsights.date);
    }
    1;

    if (!lastCreated.isSame(moment(), "day")) {
      const posts = await Post.find({ user: userId });
      const collectedNlpInsights = [];

      for (let post of posts) {
        const enrichedInsight = {
          ...post.nlpInsights,
          createdAt: post.createdAt,
        };
        collectedNlpInsights.push(enrichedInsight);
      }

      const patternInsights = await generatePatternInsight();

      nlpTasks.patternInsights = {
        message: patternInsights,
        date: moment().toDate(),
      };
      await nlpTasks.save();
    }

    res.json(nlpTasks.patternInsights.message);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting pattern insights" });
  }
});

export default router;
