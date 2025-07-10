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

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const uploadDir = path.join(__dirname, "uploads");

router.use(cors());

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  //multer is a middlerware where it will process the picture and store it in a directoy. It also changes the name of the file.
  destination: function (req, file, cb) {
    //cb is a callback function which is given by the multer for you to use.
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; //we do not use body is because body api requests can be logged but headers in default will not be logged. Bearer is important for credential checking and prevents the user from sending password and username again and again.
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key"); // Use environment variable for secret
    req.userId = decoded.userId; //you are adding a new property to the req object. Its name is userId where you add the decoded userId so that during the processing of the api they can know which user is logged in.
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

async function getNLPInsights(postContent) {
  const messages = [
    {
      role: "system",
      content:
        "You are an introspective assistant. The user gave you a timeline of their journal posts. Find 3 interesting or surprising patterns in how they think, feel, or write. Look for time-based patterns, emotional trends, repeated people or themes, or changes over time. Keep a language to a 15 year old. Give short Keep it short and insightful. From these pattern recognition what can be improved and what is something iam doing good. Given one, return a JSON with: mood, intensity (0-1), topics (list), entities (list), tone, and a short 15-word summary.",
    },
    {
      role: "user",
      content: `Here is the journal post:\n\n"${postContent}"`,
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
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse GPT response:", raw);
    return null;
  }
}

// Get all posts for a user
router.get("/user/posts", auth, async (req, res) => {
  try {
    const twentyfourhoursago = new Date(Date.now() - 300 * 60 * 60 * 1000);
    const userPosts = await Post.find({
      user: req.userId,
      date: { $gte: twentyfourhoursago },
    });
    if (!userPosts)
      return res.status(400).json({ message: "No posts found for this user." });
    res.json(userPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

router.get("/search/posts", auth, async (req, res) => {
  try {
    const searchItem = req.query.q;
    if (!searchItem) {
      const p = await Post.find({ user: req.userId });
      return res.json(p);
    }
    const filter = { user: req.userId };

    if (searchItem.startsWith("#")) {
      filter.hashTags = { $regex: searchItem, $options: "i" };
    } else {
      filter.$or = [
        { title: { $regex: searchItem, $options: "i" } },
        { content: { $regex: searchItem, $options: "i" } },
      ];
    }

    const userPosts = await Post.find(filter);

    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

router.delete("/user/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost)
      return res
        .status(404)
        .json({ message: "The root does not exist for it to be deleted." });
    return res.status(201).json({ message: "root deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ message: "The root does not exist." });
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const ligherColorsForLightTheme = [
  "#8AA7B7", // Alice Blue (darker)
  "#B28A6A", // Antique White (darker)
  "#D1A57B", // Blanched Almond (darker)
  "#A4A4D1", // Lavender (darker)
  "#9F7FAE", // Thistle (darker)
  "#8AB9B5", // Light Cyan (darker)
  "#6D9F89", // Mint Green (darker)
  "#A69F7C", // Beige (darker)
  "#E4A97A", // Pastel Peach (darker)
  "#CDA74D", // Light Gold (darker)
  "#8BAF8A", // Pale Green (darker)
  "#9F8AC9", // Soft Lavender (darker)
  "#5E8CC8", // Baby Blue (darker)
  "#E0A3A1", // Misty Rose (darker)
  "#A4D3B9", // Soft Seafoam (darker)
  "#C5A6C2", // Light Lilac (darker)
  "#D2A75C", // Wheat (darker)
  "#E3B2B6", // Pale Rose (darker)
  "#D28396", // Light Magenta (darker)
  "#8DAFBF", // Powder Blue (darker)
];
const darkerColorsForDarkTheme = [
  "#7F5B83", // Muted Purple
  "#D32F2F", // Dark Red
  "#1565C0", // Dark Blue
  "#388E3C", // Dark Green
  "#8E24AA", // Dark Magenta
  "#0288D1", // Deep Sky Blue
  "#8B4513", // Saddle Brown
  "#6A1B9A", // Deep Purple
  "#FF7043", // Burnt Orange
  "#FBC02D", // Deep Yellow
  "#388E3C", // Forest Green
  "#C2185B", // Dark Pink
  "#5D4037", // Cocoa Brown
  "#9E9D24", // Olive Green
  "#0288D1", // Royal Blue
  "#D32F2F", // Crimson Red
  "#1B5E20", // Dark Forest Green
  "#1976D2", // Medium Blue
  "#7B1FA2", // Dark Violet
  "#FF5722", // Deep Orange
];

router.post("/user/create", upload.single("image"), auth, async (req, res) => {
  try {
    const {
      title,
      mood,
      content,
      trackId,
      trackName,
      trackArtist,
      trackAlbumCover,
      hashTags,
    } = req.body;
    const nlpInsights = await getNLPInsights(content);

    const posts = await Post.find({ user: req.userId });
    const currentIndex = posts.length - 1;

    const post = new Post({
      user: req.userId,
      title,
      content,
      date: Date.now(),
      mood,
      picture: req.file ? `/uploads/${req.file.filename}` : "", //the filename is changed from the original to the new file. its changed by the mutler
      trackId,
      trackName,
      trackArtist,
      trackAlbumCover,
      hashTags,
      linearGradient: {
        light:
          ligherColorsForLightTheme[
            currentIndex % ligherColorsForLightTheme.length
          ],
        dark: darkerColorsForDarkTheme[
          currentIndex % darkerColorsForDarkTheme.length
        ],
      },
      nlpInsights,
    });
    await post.save();
    res.status(201).json({ id: post._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating post with nlp insights." });
  }
});

router.get("/posts/growth-trace", auth, async (req, res) => {
  try {
    //const { id } = req.query;
    //const post = await Post.findOne({ user: req.userId, _id: id });
    const posts = await Post.find({ user: req.userId });

    const lastPost = posts[posts.length - 1];

    const comparisonSummaries = posts.map(
      (insight, i) =>
        `Post ${i + 1}: mood - ${insight.nlpInsights.mood}, intensity - ${
          insight.nlpInsights.intensity
        }, topics - ${insight.nlpInsights.topics.join(
          ", "
        )}, entities - ${insight.nlpInsights.entities.join(", ")}, tone - ${
          insight.nlpInsights.tone
        }, summary - ${insight.nlpInsights.summary} time - ${insight.createdAt}`
    );

    const currentSummary = `mood - ${lastPost.nlpInsights.mood}, intensity - ${
      lastPost.nlpInsights.intensity
    }, topics - ${lastPost.nlpInsights.topics.join(
      ", "
    )}, entities - ${lastPost.nlpInsights.entities.join(", ")}, tone - ${
      lastPost.nlpInsights.tone
    }, summary - ${lastPost.nlpInsights.summary} time - ${lastPost.createdAt}`;

    const formedRoot = `Post to compare: ${currentSummary} and other posts ${comparisonSummaries}`;

    const messages = [
      {
        role: "system",
        content: `
      Compare this new journal entry with all past entries. Identify any personal growth, emotional change, 
      recurring struggles, or emerging themes. Focus on changes in mood, intensity, tone, topics, and summary. 
      If no significant change is found, note that as well. Keep the insight brief but reflective—like something 
      a thoughtful guide would say after reading the user’s reflections. 

      Add natural **timing** if it fits (like 'a few days ago,' 'prior months,' or 'this morning'). Only use these if they match the feeling of the root—don’t force them.

      IMPORTANT: refer to the entries or journal as "roots" 

      IMPORTANT: Please wrap the most meaningful word(s) or phrase(s) in double asterisks. These highlights should help the user quickly understand the heart of the reflection—if they only read those, they should still grasp what the trace is trying to say. Aim to include at least one such highlight in each insight.
      
      Give me the answer in the following JSON response only. Think of yourself as an Therapist. refer to the memories as roots. keep the language so that a 14 year old can understand. Give a more human type answer. Do not use hard words keep it like high school level vocabulary.
      {
        trace: "the growth or the change you found. less than 30 words"
      }
      `,
      },
      {
        role: "user",
        content: formedRoot,
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
      const parsed = JSON.parse(raw);
      return res.json({ trace: parsed });
    } catch (err) {
      console.error("Failed to parse GPT response:", raw);
      return null;
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/posts/all", auth, async (req, res) => {
  const posts = await Post.find({ user: req.userId });
  if (!posts)
    return res.status(400).json({ message: "No posts found for this user." });
  res.json(posts);
});

router.get("/deezer-proxy", async (req, res) => {
  try {
    let { q, limit = 8 } = req.query;
    if (!q) {
      q = "timeless";
    }
    const response = await axios.get("https://api.deezer.com/search", {
      //no cors error will show because cors is only enforced if an request is made from an browser. Server to server no cors will be involved.
      params: { q, limit },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Deezer:", error);
    res.status(500).json({ error: "Error fetching data from Deezer" });
  }
});

router.get("/deezer-search-song", async (req, res) => {
  try {
    const { trackId } = req.query;
    if (!trackId) {
      return res.status(400).json({ error: "trackId is required" });
    }
    const response = await axios.get(`https://api.deezer.com/track/${trackId}`);
    res.json(response.data.preview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching data from Deezer" });
  }
});

export default router;
