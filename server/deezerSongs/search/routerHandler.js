import { songSearch } from "./songSearch.js";
import express from "express";

const router = express.Router();

router.get("/deezer-proxy", async (req, res) => {
  try {
    let { q, limit = 8 } = req.query;
    const response = await songSearch(q, limit);
    res.json(response);
  } catch (error) {
    console.error("Error fetching data from Deezer:", error);
    res.status(500).json({ error: "Error fetching data from Deezer" });
  }
});

export default router;
