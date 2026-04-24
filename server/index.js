import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import questionroute from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import postroutes from "./routes/post.js";
import languageroutes from "./routes/language.js";
const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://stack-overflow-clone-oy96aoqg0-khanmahek3999-2006s-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.get("/", (req, res) => {
  res.send("Stackoverflow clone is running perfect");
});
app.use("/user", userroutes);
app.use("/question", questionroute);
app.use("/answer", answerroutes);
app.use("/post", postroutes); // This is for Post
app.use("/api", languageroutes); // This is for Language
app.use("/uploads", express.static("uploads"));// Serve static files from the "uploads" directory under the "/uploads" route.This allows clients to access uploaded files directly via URLs like /uploads/<filename>.
const PORT = process.env.PORT || 5000;
const databaseurl = process.env.MONGODB_URL;

mongoose
  .connect(databaseurl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
