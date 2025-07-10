import express from "express";
import userRoutes from "./user.js";
import rootsRoutes from "./roots.js";
import libraryRoutes from "./library.js";
import nlpTasksRoutes from "./nlpTasks.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import http from "http";

dotenv.config();

const app = express(); //intialized the server
//app.use('/uploads', express.static('uploads'));

app.use(cors()); //allows requests to be made from the frontend to this server.
app.use(express.json()); //allows the data being sent to the server in the form of json to be read and converted into json objects.

app.use("/", userRoutes);
app.use("/", rootsRoutes); //this allows different routers to be connected to the main server. Here every route that starts with "/" will be allowed. You can keep anything as the name
app.use("/library", libraryRoutes);
app.use("/nlp", nlpTasksRoutes);

app.listen(5002, () => {
  console.log("Backend server is running at http://localhost:5002");
});

{
  /*
    https.createServer(credentials, app).listen(5002, () => {
    console.log('Backend server is running at http://localhost:5002');
})
*/
}
