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
import NlpTasks from "./models/nlptasks.js";
import { auth } from "./middleware.js";
import patternInsights from "./patternInsights/patternInsight.js";
import stories from "./themeThread/stories/routerHandler.js";
import topTheme from "./themeThread/topTheme/routerHandler.js";
import themeAnalysis from "./themeThread/analyzeTheme/routerHandler.js";

dotenv.config();

const router = express.Router();

router.use(cors());

router.use("/collect", patternInsights);
router.use("/theme-thread-stories", stories);
router.use("/theme-thread-toptheme", topTheme);
router.use("/theme-analysis", themeAnalysis);

export default router;
