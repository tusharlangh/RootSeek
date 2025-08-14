import express from "express";
import { auth } from "../../middleware.js";
import { search } from "./search.js";
import axios from "axios";

const router = express.Router();

router.get("/posts", auth, async (req, res) => {
  try {
    const searchItem = req.query.q;
    const userPosts = await search(searchItem, req.userId);
    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts." });
  }
});

export default router;
