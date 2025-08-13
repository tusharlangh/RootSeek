import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

export function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; //we do not use body is because body api requests can be logged but headers in default will not be logged. Bearer is important for credential checking and prevents the user from sending password and username again and again.
  if (!token) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key"); // Use environment variable for secret
    req.userId = decoded.userId; //you are adding a new property to the req object. Its name is userId where you add the decoded userId so that during the processing of the api they can know which user is logged in.
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
}

export function storage() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const uploadDir = path.join(__dirname, "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    //multer is a middlerware where it will process the picture and store it in a directoy. It also changes the name of the file.
    destination: function (req, file, cb) {
      //cb is a callback function which is given by the multer for you to use.
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });
  return upload;
}
