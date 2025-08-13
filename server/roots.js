import express from "express";
import cors from "cors";
import axios from "axios";
import Post from "./models/post-model.js";
import moment from "moment";
import growthTrace from "./growthTrace/growthTrace.js";
import createRoot from "./roots/create/routerHandler.js";
import { auth } from "./middleware.js";

const router = express.Router();

router.use("/me", growthTrace);
router.use("/root", createRoot);

router.use(cors());

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
