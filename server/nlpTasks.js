import express from "express";
import jwt from "jsonwebtoken";
import mongoose, { set } from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import axios from "axios";
import Post from "./models/post-model.js";
import dotenv from "dotenv";
import OpenAI from "openai";
import moment from "moment";
import NlpTasks from "./models/nlptasks.js";
import { auth } from "./middleware.js";
import patternInsights from "./patternInsights/patternInsight.js";

dotenv.config();

const router = express.Router();

router.use(cors());

router.use("/collect", patternInsights);

router.get("/topThemePosts", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ user: userId });

    const topicCounts = {};
    posts.forEach((post) => {
      post.nlpInsights.topics.forEach((topic) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((entry) => entry[0]);

    const grouped = {};
    topTopics.forEach((topic) => {
      grouped[topic] = [];
      posts.forEach((post) => {
        if (post.nlpInsights.topics.includes(topic)) {
          grouped[topic].push(post);
        }
      });
    });
    res.json(grouped);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting the top theme posts." });
  }
});

router.post("/stories", auth, async (req, res) => {
  const userId = req.userId;
  const { posts, theme } = req.body;

  const nlpTasks = await NlpTasks.findOne({ user: userId });

  const tasks = nlpTasks.storiesData;

  if (
    //true === true
    !tasks[theme]
  ) {
    //we use tasks[theme] because this will give the variable theme whereas tasks.theme will check for theme itself in tasks.
    const combinedContent = posts.map(
      (post, i) =>
        `Post ${i + 1}: mood - ${post.nlpInsights.mood}, intensity - ${
          post.nlpInsights.intensity
        }, topics - ${post.nlpInsights.topics.join(
          ", "
        )}, entities - ${post.nlpInsights.entities.join(", ")}, tone - ${
          post.nlpInsights.tone
        }, summary - ${post.nlpInsights.summary}`
    );

    const apiKey = process.env.OPENAI_API_KEY;
    const messages = [
      {
        role: "system",
        content: `
        You are an introspective assistant helping a user understand their emotional and personal journey through a specific theme, such as "Learning" or "Confidence."

        Below is a personal memory entry written by the user. Your job is to extract a **milestone card** from it that highlights how this moment fits into their larger journey.

        Respond in the following JSON format:

        [
          {
            "title": "<One of: 'Breakthrough', 'Struggle', 'First Step', 'Clarity', 'Setback', 'Insight', 'Looping Pattern'>",
            "emoji": "<Relevant emoji to match the tone or theme>",
            "suspense": "<A short, emotionally loaded teaser line (like an internal voice or hook). Should be 4–8 words, evocative, and hint at tension or change.>",
            "message": "<A reflection or insight about why this moment matters or what it reveals about the user> (less than 40 words)",
            "linearGradient": ["#color1", "#color2"] assign a linear gradient color pair for each memory to visually match the emotional tone or change. Use calm or warm colors (like lavender, teal, rose, gray, navy, peach) avoid neon or saturated ones.
            "isTurningPoint": true/false,
          }
        ]

        first check if the isTurningPoint is true or false for a memory. if true then and only add to the final JSON format otherwise do not add anything and move to the next memory. 

        Keep the language for a 15 year old to understand.

        Maximum amount of milestone cards to produce is 3 and minimum is 1 do not exceed or go below this. 

        At the end take all the generated milestone and create a progression card that would tell the user its progression on that theme. 

        {
          "message": "<tells the user its progression> less than 30 words"
        }

        the final output:
        [
          {miltestone cards},
          {progression card}
        ]

        the progression card should always be at the end. 

        Be thoughtful, emotionally intelligent, and encouraging. If the memory is insightful or shows learning, highlight it. If it shows repetition, struggle, or confusion, mark it honestly but gently.
        `,
      },
      {
        role: "user",
        content: `Here are the memories and the extracted information from the memories:\n\n"${combinedContent} and the theme is: ${theme}"`,
      },
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.4,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    try {
      nlpTasks.storiesData[theme] = JSON.parse(raw); //you cannot naviage through a varaible you have to through the original variable where you stored the model extracted info.
      await nlpTasks.markModified("storiesData");
      await nlpTasks.save();
      console.error(raw);
    } catch (error) {
      console.error("Failed to parse GPT response:", raw);
    }
  }
  res.json(nlpTasks.storiesData[theme]);
});

export default router;
