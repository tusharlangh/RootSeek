import express from "express";
import jwt from "jsonwebtoken";
import mongoose, { set } from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import axios from "axios";
import Post from "./models/post-model.js";
import OpenAI from "openai";

const router = express.Router();
router.use(cors());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadDir = path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  //multer is a middlerware where it will process the picture and store it in a directoy. It also changes the name of the file.
  destination: function (req, file, cb) {
    //cb is a callback function which is given by the multer for you to use.
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
}

const libraryScheme = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    totalPosts: { type: Number, required: true },
    picture: { type: String },
    posts: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Library = mongoose.model("Library", libraryScheme);

router.get("/albums-all", auth, async (req, res) => {
  try {
    const albums = await Library.find({ user: req.userId });
    res.json(albums);
  } catch (error) {
    res.status(400).json({ message: "No albums found for this user" });
  }
});

router.get("/create-default-album", auth, async (req, res) => {
  try {
    const album = new Library({
      user: req.userId,
      type: "album",
      title: "Your Album",
      description: "",
      totalPosts: 0,
      posts: [],
      picture: "",
    });
    await album.save();
    res.json(album);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured creating the album. Try again later" });
  }
});

router.patch("/albums/:albumId/add-post", auth, async (req, res) => {
  const { post } = req.body;

  try {
    const album = await Library.findById(req.params.albumId);

    const p = await Post.findById(post._id);
    p.albumId = album._id;

    post.albumId = album._id;

    album.posts.push(post);
    album.totalPosts = album.posts.length;

    await p.save();

    await album.save();
    res.json({ message: "The post has been added to the specific album." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured adding post to album. Try again later" });
  }
});

router.patch(
  "/album/edit/:albumId",
  upload.single("picture"),
  auth,
  async (req, res) => {
    const { albumId } = req.params;

    try {
      if (!albumId) {
        res
          .status(500)
          .json({ message: "No album id is given. Try again later" });
      }
      const album = await Library.findByIdAndUpdate(albumId);
      album.title = req.body.title || album.title;
      album.description = req.body.description || album.description;
      album.posts = req.body.posts ? JSON.parse(req.body.posts) : album.posts;
      album.totalPosts = req.body.posts
        ? JSON.parse(req.body.posts).length
        : album.posts.length;
      if (req.file) {
        album.picture = `/uploads/${req.file.filename}`;
      }

      await album.save();
      res.json({ message: "Successfully edited the album" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error occured editing albums. Try again later" });
    }
  }
);

router.patch("/album/post-delete/:albumId", auth, async (req, res) => {
  const { albumId } = req.params;
  const { postId, posts } = req.body;
  try {
    if (!albumId) {
      res
        .status(500)
        .json({ message: "No album id is given. Try again later" });
    }

    const post = await Post.findById(postId);

    post.albumId = "";

    await post.save();

    const postIndex = posts.findIndex((post) => post._id === postId);

    if (postIndex === -1) {
      res
        .status(500)
        .json({ message: "The given post cannot be found inside the album" });
    }

    posts.splice(postIndex, 1);

    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured deleting. Try again later" });
  }
});

export default router;
