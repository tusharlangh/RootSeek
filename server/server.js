import express from "express"
import userRoutes from "./user.js"
import rootsRoutes from "./roots.js"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

dotenv.config()

const app = express()
//app.use('/uploads', express.static('uploads'));


app.use(cors());
app.use(express.json())

app.use("/", userRoutes)
app.use("/", rootsRoutes)


app.listen(5002, () => {
    console.log('Backend server is running at http://localhost:5002');
})