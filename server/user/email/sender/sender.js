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

const sendVerificationEmail = async (name, email, code) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5; padding: 30px">
      <div style="text-align: center;">
        <h2 style="color: #000000ff; font-size: 40px">Welcome to <br>RootSeek!</h2>
      </div>
      <p>Hello, ${name[0].toUpperCase() + name.splice(1)}.</p>
      <p>Thankyou for signing up. Please enter the following code to verify your email address.</p>
      <h1 style="font-size: 28px; letter-spacing: 2px;"><strong>${code}</strong></h1>
      <p>
        This code is valid for 20 minutes and can only be used once.
      </p>
      <p>Best regards,<br>Tushar Langhnoda</p>
    </div>
  `;

  const mailOptions = {
    from: `Rootseek team`,
    to: email,
    subject: `${code} - Your Rootseek verification code`,
    html: htmlContent,
  };
  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
