import { verify } from "./verify.js";
import express from "express";
const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    let { email, verificationCode } = req.body;
    email = email.toLowerCase();
    const { status, message } = await verify(email, verificationCode);
    res.status(status).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
