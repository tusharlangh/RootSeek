import express from "express";
import { login } from "./login.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  const { success, message, token } = await login(email, password); //the userId is the data that you are encoding inside the token. The key is used whenever you want to access the encoded data. Safety reason.
  if (!success) {
    return res.status(400).json({ message: message });
  }
  res.json({ token });
});

export default router;
