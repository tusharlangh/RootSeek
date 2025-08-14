import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your RootSeek account verification code",
    text: `Hi,
    Enter this code to create your account: ${code}
    `,
  };
  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
