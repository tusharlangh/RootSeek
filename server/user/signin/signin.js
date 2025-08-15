import bcrypt from "bcryptjs";
import User from "../../models/user-model.js";
import sendVerificationEmail from "../email/sender/sender.js";

export async function signin(email, firstName, lastName, username, password) {
  if (!email || !firstName || !lastName || !username || !password) {
    return { status: 400, message: "Fields are required." };
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { status: 400, message: "The email already exists." };
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
  await sendVerificationEmail(firstName, email, verificationCode);

  return { status: 201, message: "User registered." };
}
