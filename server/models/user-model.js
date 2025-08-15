import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  tempEmail: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

export default User;
