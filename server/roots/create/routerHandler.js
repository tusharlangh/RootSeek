import { createRoot } from "./createRoot.js";
import { storage, auth } from "../../middleware.js";
import express from "express";

const router = express.Router();

router.post("/create", storage().single("image"), auth, async (req, res) => {
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

    const file = req.file;
    const filename = file ? file.filename : "";

    const createdRoot = await createRoot(
      title,
      mood,
      content,
      trackId,
      trackName,
      trackArtist,
      trackAlbumCover,
      hashTags,
      req.userId,
      file,
      filename
    );

    res.status(201).json({ id: createdRoot._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating post with nlp insights." });
  }
});

export default router;
