import express from "express";
import cors from "cors";
import axios from "axios";
import growthTrace from "./growthTrace/growthTrace.js";
import createRoot from "./roots/create/routerHandler.js";
import singleRoot from "./roots/get/singlePost/routerHandler.js";
import allRoots from "./roots/get/allPosts/routerHandler.js";
import twentyFourHPosts from "./roots/get/twentyFourPosts/routerHandler.js";
import searchRoot from "./roots/search/routerHandler.js";

const router = express.Router();
router.use(cors());

router.use("/me", growthTrace);
router.use("/root", createRoot); //create.js
router.use("/single", singleRoot);
router.use("/all", allRoots);
router.use("/24-hours", twentyFourHPosts); //home.js
router.use("/search", searchRoot); // search.js

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
