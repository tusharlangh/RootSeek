import { singleSong } from "./singleSong.js";
import express from "express";

const router = express.Router();

router.get("/deezer-search-song", async (req, res) => {
  try {
    const { trackId } = req.query;

    if (!trackId) {
      return res.status(400).json({ error: "trackId is required" });
    }

    const response = await singleSong(trackId);
    res.json(response.preview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching data from Deezer" });
  }
});

export default router;
