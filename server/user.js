import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import sendVerificationEmail from "./emailverif.js";
import dotenv from "dotenv"

dotenv.config()

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
const uri = process.env.URI

mongoose.connect(uri)
.then(() => console.log("Connected to mongoose"))
.catch((err) => console.error(`Connection to mongoose failed. Error: ${err}`))

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, unique: true, sparse: true, required: true},
    email: {type: String, unique: true, sparse: true, required: true},
    password: {type: String, required: true},
    verificationCode: { type: String },
    verified: { type: Boolean, default: false },
})

const User = mongoose.model("User", userSchema)

router.post("/user/verify", async (req, res) => {
    try {
        let {email, verificationCode} = req.body
        email = email.toLowerCase();
        const user = await User.findOne({email})
        if (!user) return res.status(400).json({message: "user not found."})
        if (String(user.verificationCode) !== String(verificationCode)) {
            return res.status(400).json({message:"Invalid verification code."})
        }
        
        user.verificationCode = null
        user.verified = true
        await user.save()

        res.json({message : "Email successfully verified!"})
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
})

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
    let {email, password} = req.body
    email = email.toLowerCase()
    const user = await User.findOne({email})
    if (!user) return res.status(400).json({message: "Invalid email and password."})
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({message: "Invalid password"})
    const token = jwt.sign({userId: user._id}, "your_jwt_secret_key", {expiresIn: "5h"})
    res.json({token}) 
})

router.post("/user/signin", async (req, res) => {
    try {
        let {email, firstName, lastName, username, password} = req.body
        email = email.toLowerCase()
        if (!email || !firstName || !lastName || !username || !password) {
            return res.status(400).json({message: "Fields are required."})
        }
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: "The email already exists."})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({firstName, lastName, username, email, password:hashedPassword, verificationCode, verified: false})

        await user.save()
        await sendVerificationEmail(email, verificationCode)

        res.status(201).json({message: "User registered."})
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "An error occurred during registration." });
    }
})



export default router