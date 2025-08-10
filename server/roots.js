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

router.get("/posts/growth-trace", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });

    const lastPost = posts[posts.length - 1];

    const comparisonSummaries = posts.map((insight, i) => {
      if (i === posts.length - 1) return null;
      const daysAgo = moment(lastPost.createdAt).diff(
        moment(insight.createdAt),
        "days"
      );

      if (daysAgo < 60) {
        return `Post ${i + 1}: mood - ${
          insight.nlpInsights.mood
        }, intensity - ${
          insight.nlpInsights.intensity
        }, topics - ${insight.nlpInsights.topics.join(
          ", "
        )}, entities - ${insight.nlpInsights.entities.join(", ")}, tone - ${
          insight.nlpInsights.tone
        }, summary - ${insight.nlpInsights.summary} time - ${moment(
          insight.createdAt
        ).toDate()}`;
      }
      return null;
    });

    //console.log(comparisonSummaries);
    let past60Days = [];

    for (let post of posts) {
      const daysAgo = moment(lastPost.createdAt).diff(
        moment(post.createdAt),
        "days"
      );
      if (daysAgo < 60) {
        past60Days.push(post);
      }
    }

    function getSequential(label) {
      const periods = {
        "1_10": [],
        "11_20": [],
        "21_30": [],
        "31_40": [],
        "41_50": [],
        "51_60": [],
      };

      for (let post of past60Days) {
        const diff = moment(lastPost.createdAt).diff(
          moment(post.createdAt),
          "days"
        );

        if (diff > 50) {
          periods["1_10"].push(post.nlpInsights[label]);
        } else if (diff > 40) {
          periods["11_20"].push(post.nlpInsights[label]);
        } else if (diff > 30) {
          periods["21_30"].push(post.nlpInsights[label]);
        } else if (diff > 20) {
          periods["31_40"].push(post.nlpInsights[label]);
        } else if (diff > 10) {
          periods["41_50"].push(post.nlpInsights[label]);
        } else {
          periods["51_60"].push(post.nlpInsights[label]);
        }
      }

      return periods;
    }

    const moodSequential = getSequential("mood");
    const toneSequential = getSequential("tone");
    const intensitySequential = getSequential("intensity");

    const currentSummary = `mood - ${lastPost.nlpInsights.mood}, intensity - ${
      lastPost.nlpInsights.intensity
    }, topics - ${lastPost.nlpInsights.topics.join(
      ", "
    )}, entities - ${lastPost.nlpInsights.entities.join(", ")}, tone - ${
      lastPost.nlpInsights.tone
    }, summary - ${lastPost.nlpInsights.summary} time - ${lastPost.createdAt}`;

    const formedRoot = `here is the JSON data: mood: ${JSON.stringify(
      moodSequential
    )}, tone: ${JSON.stringify(toneSequential)}, intensity: ${JSON.stringify(
      intensitySequential
    )}`;

    const messages = [
      {
        role: "system",
        content: `
        You are an expert in emotional data aggregation and analysis.

        You will be given three JSON objects representing a user’s emotional data over 60 days, divided into sequential 10-day segments:

        1. Moods by segment: each key maps to a list of mood labels (strings), e.g. { '1_10': ['thoughtful', 'peaceful'], ... }  
        2. Tones by segment: each key maps to a list of tone descriptions (strings), e.g. { '1_10': ['reflective and curious', 'calm and appreciative'], ... }  
        3. Intensities by segment: each key maps to a list of numeric intensity values (floats between 0 and 1), e.g. { '1_10': [0.6, 0.4], ... }

        Your task:

        For each 10-day segment (keys like '1_10', '11_20', etc.):  
        - Determine the **dominant mood** by selecting the mood label that appears most frequently;  
          - If multiple moods tie, select a single mood that best represents or combines the tied moods semantically (choose one existing mood word, not a phrase).  
          - If the list is empty, the dominant mood for that segment is "null".

        - Determine the **dominant tone** by selecting the tone description that appears most frequently;  
          - If multiple tones tie, select the tone that best captures the overall emotional style of the segment.  
          - If the list is empty, the dominant tone for that segment is "null".

        - Calculate the **average intensity** for the segment rounded to two decimal places;  
          - If the intensity list is empty, the average intensity for that segment is "null".

        Additionally, compute the following **overall metrics across all segments**:  
        - The dominant mood across all moods in all segments combined, using the same tie-breaking logic as above.  
        - The dominant tone across all tones in all segments combined, using the same tie-breaking logic as above.  
        - The average intensity across all intensity values from all segments, rounded to two decimals.

        Output only valid JSON in this exact structure:

        {
          "overall": {
            "mood": "dominant mood or null",
            "tone": "dominant tone or null",
            "intensity": average intensity or null
          },
          "segments": {
            "1_10": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "11_20": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "21_30": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "31_40": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "41_50": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "51_60": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            }
          }
        }
        `,
      },
      {
        role: "user",
        content: formedRoot,
      },
    ];

    const response1 = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages,
        temperature: 0,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw1 = response1.data.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw1);
      //console.log(parsed.overall);
      //console.log(parsed.segments);
    } catch (err) {
      console.error("Invalid JSON from AI:", raw1);
      throw err;
    }

    const messages2 = [
      {
        role: "system",
        content: `
        You are an expert in emotional trend analysis and personal growth detection.

        You will be given:
        1. The most dominant mood, tone, and intensity across the last 60 days.
        2. The most dominant mood, tone, and intensity for each sequential 10-day period within those 60 days (some periods may be null if no entries).
        3. The latest entry, with its mood label, tone description, and intensity value.

        Your task:
        1. Compare the latest entry’s mood, tone, and intensity to:
          - The overall dominant mood, tone, and intensity across 60 days.
          - The dominant mood, tone, and intensity of the most recent 10-day period (or the last non-null period if the most recent is null).

        2. Determine whether there is:
          - **Positive growth** → The latest mood and tone show improvement toward more positive or balanced states, and/or the intensity reflects healthier emotional regulation compared to recent or long-term patterns.
          - **Regression** → The latest mood and tone reflect a decline toward more negative or unstable states, and/or the intensity indicates escalating emotional distress.
          - **Stability** → The latest mood and tone align with past positive trends, and intensity remains consistent, showing emotional steadiness.
          - **Recovery** → The latest mood and tone are more positive after a recent negative trend, and intensity shows decreasing negative emotional intensity or increasing positive emotional energy.

        3. Incorporate semantic similarity when comparing moods and tones:
          - If moods or tones are semantically close (e.g., "calm" and "peaceful", "reflective" and "thoughtful"), treat them as aligned.
          - If moods or tones are distinctly different (e.g., "calm" and "anxious", "reflective" and "frustrated"), treat them as a meaningful change in emotional state or mindset.

        4. Use intensity to assess emotional strength:
          - Higher intensity in positive moods/tone can indicate greater emotional engagement or growth.
          - Lower intensity in negative moods/tone can indicate improved coping or reduced distress.
          - Sudden spikes or drops in intensity should be noted as signs of change or volatility.

        5. Use natural, empathetic language and avoid exaggerated language to summarize the personal growth insight in **1–3 sentences**, referencing time naturally when relevant (e.g., “over the past month,” “in the last two weeks,” “today”).
        6. Do not reference 60 days pattern or recent 10 days pattern. Sound it trustworthy 

        Output format:
        Return only valid JSON in this exact structure:
        {
          "growth_type": "positive_growth | regression | stability | recovery",
          "insight": "Brief natural-language insight summarizing the change or stability in the user's emotional state, incorporating mood, tone, and intensity."
        }
        `,
      },
      {
        role: "user",
        content: `latest root's mood ${
          lastPost.nlpInsights.mood
        }, latest root's tone ${
          lastPost.nlpInsights.tone
        }, latest root's intensity ${
          lastPost.nlpInsights.intensity
        }, the most dominant mood, tone, intensity across 60 days is ${JSON.stringify(
          parsed.overall
        )} and the most dominant mood, tone and intensity across 10 days sequencial is in this object: ${JSON.stringify(
          parsed.segments
        )}`,
      },
    ];

    const response2 = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: messages2,
        temperature: 0,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw2 = response2.data.choices[0].message.content;

    try {
      const parsed = JSON.parse(raw2);
      //console.log(parsed.growth_type);
      //console.log(parsed.insight);
      return res.json({ trace: parsed });
    } catch (err) {
      console.error("Failed to parse GPT response:", raw2);
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
