import bcrypt from "bcryptjs";
import User from "../../models/user-model.js";
import jwt from "jsonwebtoken";

export async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) return { success: false, message: "Invalid email and password." };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { message: "Invalid password" };

  const token = jwt.sign(
    { success: false, userId: user._id },
    "your_jwt_secret_key",
    {
      expiresIn: "24h",
    }
  );
  return { success: true, token };
}
