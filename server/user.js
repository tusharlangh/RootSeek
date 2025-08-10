import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "./emailverif.js";
import dotenv from "dotenv";

dotenv.config(); //imports the env stuff from the .env file

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

const router = express.Router(); //starts a routing system so that you can connect the router to your main server on your main server file.
const uri = process.env.URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to mongoose"))
  .catch((err) =>
    console.error(`Connection to mongoose failed. Error: ${err}`)
  );

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, sparse: true, required: true },
  email: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  tempEmail: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

router.post("/user/verify", async (req, res) => {
  try {
    let { email, verificationCode } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found." });
    if (String(user.verificationCode) !== String(verificationCode)) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.verificationCode = null;
    user.verified = true;
    await user.save();

    res.json({ message: "Email successfully verified!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(400).json({ message: "user not found" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error occured." });
  }
});

router.get("/user/details", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    //const user = await User.find()
    if (!user) return res.status(400).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error occured." });
  }
});

router.post("/user/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email and password." });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret_key", {
    expiresIn: "24h",
  }); //the userId is the data that you are encoding inside the token. The key is used whenever you want to access the encoded data. Safety reason.
  res.json({ token });
});

router.post("/user/signin", async (req, res) => {
  try {
    let { email, firstName, lastName, username, password } = req.body;
    email = email.toLowerCase();
    if (!email || !firstName || !lastName || !username || !password) {
      return res.status(400).json({ message: "Fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "The email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verified: false,
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User registered." });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});

router.patch("/user/updateinformation", auth, async (req, res) => {
  try {
    const updates = req.body;
    if (!req.userId || !updates)
      return res
        .status(400)
        .json({ message: "Userid or the sent data is not valid." });
    const updatedInfo = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({ message: "User information updated." });
  } catch (error) {
    res.status(500).json({ message: "Server had a problem" });
  }
});

router.post("/user/updateEmail", auth, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!req.userId || !newEmail)
      return res
        .status(400)
        .json({ message: "Userid or the sent data is not valid." });

    const existingUser = await User.findById(req.userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }
    if (existingUser.email === newEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists. Enter a different email." });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await User.findByIdAndUpdate(req.userId, {
      tempEmail: newEmail,
      verificationCode,
      verified: false,
    });

    await sendVerificationEmail(newEmail, verificationCode);

    res.status(201).json({ message: "User information updated." });
  } catch (error) {
    res.status(500).json({ message: "Server had a problem" });
  }
});

router.post("/user/verify-email", auth, async (req, res) => {
  try {
    let { email, verificationCode } = req.body;
    email = email.toLowerCase();

    const user = await User.findById(req.userId);

    if (!user) return res.status(400).json({ message: "user not found." });

    if (user.tempEmail === "")
      return res.status(400).json({ message: "No email update requested." });

    if (String(user.verificationCode) !== String(verificationCode)) {
      user.tempEmail = "";
      await user.save();
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.email = user.tempEmail;
    user.verificationCode = null;
    user.verified = true;
    user.tempEmail = "";

    await user.save();

    res.json({ message: "Email successfully verified!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/user/updatePassword", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: "user not found." });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Successfully updated password" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred." });
  }
});

export default router;
