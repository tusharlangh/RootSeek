import User from "../../../models/user-model.js";

export async function verify(email, verificationCode) {
  const user = await User.findOne({ email });
  if (!user) return { status: 400, message: "user not found." };
  if (String(user.verificationCode) !== String(verificationCode)) {
    return { status: 400, message: "Invalid verification code." };
  }
  user.verificationCode = null;
  user.verified = true;
  await user.save();

  return { status: 201, message: "Email successfully verified!" };
}
