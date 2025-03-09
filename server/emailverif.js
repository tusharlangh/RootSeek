import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to:email,
        subject: "Verify your email",
        text: `Your verification code is: ${code}`
    }
    await transporter.sendMail(mailOptions)
}

export default sendVerificationEmail

