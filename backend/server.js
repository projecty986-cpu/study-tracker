const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config();

const entryRoutes = require("./routes/entryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://projecty986_db_user:FO8fzDpGyHFO8JP6@ac-hdssnur-shard-00-00.enu1gzc.mongodb.net:27017,ac-hdssnur-shard-00-01.enu1gzc.mongodb.net:27017,ac-hdssnur-shard-00-02.enu1gzc.mongodb.net:27017/studytracker?ssl=true&replicaSet=atlas-zijg6x-shard-0&authSource=admin&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// API routes
app.use("/api", entryRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
