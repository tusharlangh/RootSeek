import express from "express";
import jwt from "jsonwebtoken";
import mongoose, { set } from "mongoose";
import multer from "multer";
import path from "path"
import fs from "fs";
import cors from "cors"
import axios from "axios";

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const uploadDir = path.join(__dirname, "uploads");

router.use(cors())

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({ //multer is a middlerware where it will process the picture and store it in a directoy. It also changes the name of the file. 
  destination: function (req, file, cb) { //cb is a callback function which is given by the multer for you to use.
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage})

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];//we do not use body is because body api requests can be logged but headers in default will not be logged. Bearer is important for credential checking and prevents the user from sending password and username again and again.
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key"); // Use environment variable for secret
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

const postScheme = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    mood: { type: String },
    picture: {type: String},
    trackId: {type: String, default: ""},
    trackName: {type: String, default: ""},
    trackArtist: {type: String, default: ""},
    trackAlbumCover: {type: String, default: ""},
    hashTags: {type: String, default: ""},
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postScheme);

// Get all posts for a user
router.get("/user/posts", auth, async (req, res) => {
  try {
    const twentyfourhoursago = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const userPosts = await Post.find({ user: req.userId, date: {$gte: twentyfourhoursago} });
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
    const searchItem = req.query.q
    if (!searchItem) {
      const p = await Post.find({user: req.userId})
      return res.json(p)
    }
    const filter = { user: req.userId };

    if (searchItem.startsWith("#")) {
      filter.hashTags = { $regex: searchItem, $options: "i" };
    } else {
      filter.$or = [{title: { $regex: searchItem, $options: "i" }}, {content: { $regex: searchItem, $options: "i" }}]
    }

    const userPosts = await Post.find(filter);

    
    res.json(userPosts)
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({message: "Error fetching posts."})
  }
})

router.delete("/user/delete/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedPost = await Post.findByIdAndDelete(id)
    if (!deletedPost) return res.status(404).json({message: "The root does not exist for it to be deleted."})
    return res.status(201).json({message: "root deleted"})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})

router.get("/user/post/:id", async (req,res) => {
  try {
    const {id} = req.params
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({message: "The root does not exist."})
    return res.json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
})

// Create a new post for a user
router.post("/user/create",upload.single("image"), auth, async (req, res) => {
  try {
    const { title, mood, content, trackId, trackName, trackArtist, trackAlbumCover, hashTags } = req.body;
    const post = new Post({
      user: req.userId,
      title,
      content,
      date: Date.now(), 
      mood,
      picture: req.file ? `/uploads/${req.file.filename}` : "",//the filename is changed from the original to the new file. its changed by the mutler
      trackId,
      trackName,
      trackArtist,
      trackAlbumCover,
      hashTags
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating post." });
  }
});

router.get("/posts/all", async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
})

router.get("/deezer-proxy", async (req,res) => {
  try {
    let { q, limit=8 } = req.query;
    if (!q) {
      q = "timeless"
    }
    const response = await axios.get('https://api.deezer.com/search', {
      params: { q, limit }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching data from Deezer:', error);
    res.status(500).json({ error: 'Error fetching data from Deezer' });
  }
})

router.get("/deezer-search-song", async (req, res) => {
  try {
    const {trackId} = req.query;
    if (!trackId) {
      return res.status(400).json({ error: 'trackId is required' });
    }
    const response = await axios.get(`https://api.deezer.com/track/${trackId}`)
    res.json(response.data.preview)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching data from Deezer' });
  }
})



export default router;
