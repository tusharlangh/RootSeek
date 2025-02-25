import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { body } from "framer-motion/client";

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key"); // Use environment variable for secret
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

const router = express.Router()
const uri = 'mongodb+srv://Tusharlanghnoda:VFWn9GNqI9yTSiSa@cluster0.p2fmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(uri)
.then(() => console.log("Connected to mongoose"))
.catch((err) => console.error(`Connection to mongoose failed. Error: ${err}`))

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, unique: true, sparse: true, required: true},
    email: {type: String, unique: true, sparse: true, required: true},
    password: {type: String, required: true},
})

const User = mongoose.model("User", userSchema)

router.get("/users/all", async (req, res) => {
    try {
        const users = await User.find()
        if (!users) return res.status(400).json({message : "user not found"})
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "error occured."})
    }
})



router.get("/user/details", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -email")
        //const user = await User.find()
        if (!user) return res.status(400).json({message : "user not found"})
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "error occured."})

    }
})

router.post("/user/login", async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user) return res.status(400).json({message: "User no found. Please check your username and password."})
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({message: "Entered password is wrong."})
    const token = jwt.sign({userId: user._id}, "your_jwt_secret_key", {expiresIn: "1h"})
    res.json({token}) 
})

router.post("/user/signin", async (req, res) => {
    try {
        const {email, firstName, lastName, username, password} = req.body
        if (!email || !firstName || !lastName || !username || !password) {
            return res.status(400).json({message: "Fields are required."})
        }
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: "The email already exists."})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({firstName, lastName, username, email, password:hashedPassword})
        await user.save()
        res.status(201).json({message: "User registered."})
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "An error occurred during registration." });
    }
    
})

export default router