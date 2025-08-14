import express from "express";
import cors from "cors";
import growthTrace from "./growthTrace/growthTrace.js";
import createRoot from "./roots/create/routerHandler.js";
import singleRoot from "./roots/get/singlePost/routerHandler.js";
import allRoots from "./roots/get/allPosts/routerHandler.js";
import twentyFourHPosts from "./roots/get/twentyFourPosts/routerHandler.js";
import searchRoot from "./roots/search/routerHandler.js";
import deezerSearch from "./deezerSongs/search/routerHandler.js";
import deezerFetchSingle from "./deezerSongs/get/routerHandler.js";

const router = express.Router();
router.use(cors());

router.use("/me", growthTrace);
router.use("/root", createRoot); //create.js
router.use("/single", singleRoot);
router.use("/all", allRoots);
router.use("/24-hours", twentyFourHPosts); //home.js
router.use("/search", searchRoot); // search.js
router.use("/search-deezer", deezerSearch); //trackBottomSheet.js
router.use("/single-deezer", deezerFetchSingle); //trackBottomSheet.js

export default router;
