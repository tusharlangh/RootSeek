import express from "express";
import userlogin from "./user/login/routerHandler.js";
import userSignin from "./user/signin/routerHandler.js";
import userVerify from "./user/email/verify/routerHandler.js";
import cors from "cors";

const router = express.Router(); //starts a routing system so that you can connect the router to your main server on your main server file.
router.use(cors());

router.use("/user-login", userlogin);
router.use("/user-signin", userSignin);
router.use("/user-verify", userVerify);

{
  /* NOT USING!!
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
*/
}

export default router;
