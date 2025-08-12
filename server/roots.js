import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import axios from "axios";
import Post from "./models/post-model.js";
import dotenv from "dotenv";
import moment from "moment";
import growthTrace from "./growthTrace/growthTrace.js";
import { auth } from "./middleware.js";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

router.use("/me", growthTrace);

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

// Get all posts for a user in the last 24 hours
router.get("/user/posts", auth, async (req, res) => {
  try {
    const twentyfourhoursago = moment().subtract(24, "hours");
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
      const chartTracks = await getChart(); // <- FIX HERE
      res.json(chartTracks);
      return;
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

const getChart = async () => {
  try {
    const response = await axios.get("https://api.deezer.com/chart/0");
    return response.data.tracks;
  } catch (error) {
    console.error(error);
  }
};

export default router;
