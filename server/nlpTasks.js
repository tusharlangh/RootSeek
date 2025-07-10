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

const router = express.Router();

router.use(cors());

const nlpTasksScheme = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patternInsights: {
    message: { type: Object },
    date: { type: Date, default: Date.now() },
  },
  storiesData: {
    type: Object,
    default: {},
  },
});

const NlpTasks = mongoose.model("NlpTasks", nlpTasksScheme);

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

async function getPatternInsights(postContent) {
  const apiKey = process.env.OPENAI_API_KEY;
  const messages = [
    {
      role: "system",
      content: `You are an introspective assistant looking at a user's journal entries to find patterns in how they
                live their life. Look across all the entries, not just one, to find repeated emotional cycles, habits, 
                routines, or identity shifts. Focus on things the user might not notice themselves — both positive 
                and negative. Mention specific times if necessary, feelings, or situations if possible. For each insight, 
                also add a short motivational or encouraging line related to it — like a gentle life lesson. Use calm, 
                simple language as if you're helping a thoughtful 14-year-old understand themselves better. Each insight 
                must be under 30 words, and the motivation under 20 words. Do not use hyphens. Format your response in 
                this exact JSON structure:
                Only give me 2 of the best insights. 
                {
                "insight1": "Your first insight here\n\n\nMotivational message for insight1", 
                "insight2": "Your second insight here\n\n\nMotivational message for insight2"
                }
                `,
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

router.get("/creat-patterns", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ user: userId });
    let nlpTasks = await NlpTasks.findOne({ user: userId });
    const collectedNlpInsights = [];

    for (let post of posts) {
      const enrichedInsight = {
        ...post.nlpInsights,
        createdAt: post.createdAt,
      };
      collectedNlpInsights.push(enrichedInsight);
    }

    const randomTwo = collectedNlpInsights
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const combinedContent = collectedNlpInsights.map(
      (insight, i) =>
        `Post ${i + 1}: mood - ${insight.mood}, intensity - ${
          insight.intensity
        }, topics - ${insight.topics.join(
          ", "
        )}, entities - ${insight.entities.join(", ")}, tone - ${
          insight.tone
        }, summary - ${insight.summary} time - ${insight.createdAt}`
    );

    const patternInsights = await getPatternInsights(combinedContent);

    nlpTasks.patternInsights = {
      message: patternInsights,
      date: moment().toDate(),
    };
    await nlpTasks.save();
    res.json(nlpTasks.patternInsights.message);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured collecting pattern insights" });
  }
});

const generatePatternInsight = async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const posts = await Post.find();
  const randomNum = Math.floor(Math.random() * posts.length);

  const randomPost = posts[randomNum];

  let randomPostSummary = `id: ${randomPost._id}, tags: ${randomPost.hashTags}, root-summary: ${randomPost.nlpInsights.summary}}`;

  const tagsSummary = posts.map(
    (post, index) =>
      `id: ${post._id}, tags: ${post.hashTags}, root-summary: ${post.nlpInsights.summary}`
  );

  const tagsMessage = [
    {
      role: "system",
      content: `
      You are given a list of journal roots. Each root has an ID, a list of tags, and a summary. You are also given one root to compare against.

      Your job is to return the IDs of all journal roots that have either:
      - Tags that exactly match any of the tags from the comparison root (MUST include these), OR
      - Tags that are semantically similar in meaning (use synonym or closely related concept matching).
      - IMPORTANT: More than 1 ID must be found.

      Respond ONLY with the IDs in a JSON array like this:
      ["id1", "id2", "id3"]

      Do not return any explanations, just the array.
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots: ${tagsSummary} \n\nCompare them against this root: ${randomPostSummary}`,
    },
  ];

  const tagsResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages: tagsMessage,
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

  const tagsRaw = JSON.parse(tagsResponse.data.choices[0].message.content);

  try {
    console.log("tags: " + tagsRaw);
  } catch (error) {
    console.error(error);
  }

  const extractedTags = [];

  for (let id of tagsRaw) {
    const root = await Post.findById(id);
    extractedTags.push(root);
  }

  randomPostSummary = `id: ${randomPost._id}, mood: ${randomPost.nlpInsights.mood}, intensity: ${randomPost.nlpInsights.intensity}, tone: ${randomPost.nlpInsights.tone}`;

  const moodsSummary = extractedTags.map(
    (post, index) =>
      `id: ${post._id}, mood: ${post.nlpInsights.mood}, intensity: ${post.nlpInsights.intensity}, tone: ${post.nlpInsights.tone}`
  );

  const moodsMessage = [
    {
      role: "system",
      content: `
      You are given a list of journal roots. Each root has:
      - an ID
      - a mood
      - an intensity
      - a tone

      You are also given one root to compare against.

      Your job:
      - Return the IDs of all journal roots that either:
        - Have the **same** mood, tone, and intensity as the comparison root
        - OR have **similar** mood, tone, and intensity (use natural language understanding to decide what is similar)

      Rules:
      - IMPORTANT: Return **more than 1 ID**
      - Respond ONLY with the IDs in a JSON array, like this: ["id1", "id2", "id3"]
      - Do not return any explanations or extra content
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots:\n${moodsSummary}\n\nCompare them against this root:\n${randomPostSummary}`,
    },
  ];

  const moodsResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages: moodsMessage,
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

  const moodsRaw = JSON.parse(moodsResponse.data.choices[0].message.content);

  try {
    console.log("moods: " + moodsRaw);
  } catch (error) {
    console.error(error);
  }

  const extractedMoods = [];

  for (let id of moodsRaw) {
    const root = await Post.findById(id);
    extractedMoods.push(root);
  }
  extractedMoods.push(randomPost);

  const insightSummary = extractedMoods.map(
    (insight, i) =>
      `id: ${insight._id}, 
      content: ${insight.content}, 
      topics: ${insight.nlpInsights.topics.join(", ")}, 
      entities: ${insight.nlpInsights.entities.join(", ")}, 
      time: ${insight.createdAt}`
  );

  const insightMessage = [
    {
      role: "system",
      content: `
      You are given a collection of personal journal roots. Each root contains a user’s reflection or memory, 
      including details such as mood, tone, intensity, topics, and emotional content.
      Your task is to analyze all the roots together and find any emerging patterns — these can be 
      emotional habits, recurring struggles, positive shifts, mindset loops, repeated behaviors, or themes. 
      Patterns can be either helpful or unhelpful, clear or subtle — but must be meaningful.
      For each pattern insight, provide:
      A clear and reflective statement about the pattern you've observed (concise but insightful). less than 40 words.
      A short, motivational or gentle life lesson that speaks directly to that pattern — something encouraging, less than 20 words
      thoughtful, and non-judgmental.
      Use calm, simple language as if you're helping a thoughtful 14-year-old understand themselves better. Think of yourself as a professional senior therapist.

      You can generate as how many insights you can find between the roots but give me the best 2 only.

      This exact JSON structure:
        Only give me 2 of the best insights. 
        {
        "insight1": "Your first insight here\n\n\nMotivational message for insight1", 
        "insight2": "Your first insight here\n\n\nMotivational message for insight2", 
        }
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots:\n${insightSummary}`,
    },
  ];

  const insightResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages: insightMessage,
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

  const insightRaw = JSON.parse(
    insightResponse.data.choices[0].message.content
  );

  try {
    return insightRaw;
  } catch (error) {
    console.error(error);
  }
};

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
