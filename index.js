require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const Video = require("./models/Video");
const videoRoutes = require("./routes/videos");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Change to your frontend URL in production
  })
);
app.use(express.json());
app.use("/videos", express.static("public/videos"));
app.use("/api", videoRoutes);

// MongoDB Connection
// Connect to MongoDB without deprecated options
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Call the addVideo function here, after the connection is established
    addVideo();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function dropDatabase() {
  await mongoose.connection.dropDatabase();
  console.log("Database dropped.");
}

// Function to add a video document
async function addVideo() {
  try {
    dropDatabase();
    const video = await Video.create({
      url: "http://localhost:5000/videos/video01.mp4",
      sentence: "＿だようね",
      word: "そう",
    });
    const video2 = await Video.create({
      url: "http://localhost:5000/videos/video02.mp4",
      sentence: "＿",
      word: "かべ",
    });
    const video3 = await Video.create({
      url: "http://localhost:5000/videos/video03.mp4",
      sentence: "＿お願いします",
      word: "よろしく",
    });
    const video4 = await Video.create({
      url: "http://localhost:5000/videos/video04.mp4",
      sentence: "＿って",
      word: "キモイ",
    });
    console.log("Video added:", video);
    console.log("Video 2 added:", video2);
    console.log("Video 3 added:", video3);
    console.log("Video 4 added:", video4);
  } catch (error) {
    console.error("Error adding video:", error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
