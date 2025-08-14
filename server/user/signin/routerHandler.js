import express from "express";
import { signin } from "./signin.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    let { email, firstName, lastName, username, password } = req.body;
    email = email.toLowerCase();

    const { status, message } = await signin(
      email,
      firstName,
      lastName,
      username,
      password
    );

    res.status(status).json({ message });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});

export default router;
