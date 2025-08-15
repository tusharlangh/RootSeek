import express from "express";
import userRoutes from "./user.js";
import rootsRoutes from "./roots.js";
import nlpTasksRoutes from "./nlpTasks.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.URI;

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to mongoose");

    app.use("/", userRoutes);
    app.use("/", rootsRoutes);
    app.use("/nlp", nlpTasksRoutes);

    app.listen(5002, () => {
      console.log("Backend server is running at http://localhost:5002");
    });
  } catch (err) {
    console.error(`Connection to mongoose failed. Error: ${err}`);
  }
}

startServer();
