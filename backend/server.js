/* =============================================
   TODAY I LEARNED — STUDY TRACKER
   Backend Server: server.js
   ============================================= */

// ---- Load Required Packages ----
// These are packages we installed via npm.
const express  = require("express");  // Express: creates our web server
const mongoose = require("mongoose"); // Mongoose: connects to and manages MongoDB
const cors     = require("cors");     // CORS: lets the frontend (on a different port) talk to this server
const dotenv   = require("dotenv");   // dotenv: loads environment variables from .env file

// ---- Load environment variables from .env file ----
// This lets us read MONGO_URI and PORT without hardcoding them
dotenv.config();

// ---- Import our routes file ----
// We've put all /api/entries routes in a separate file to keep things organized.
const entryRoutes = require("./routes/entryRoutes");

// ---- Create the Express App ----
// Think of `app` as our server object. We configure it and attach routes to it.
const app = express();

// ---- Middleware ----
// Middleware = code that runs on EVERY request before it reaches our routes.

// 1. CORS Middleware
// Without this, the browser will block requests from frontend (port 5500)
// to backend (port 5000) because they're on different ports.
app.use(cors());

// 2. JSON Middleware
// This tells Express to automatically parse incoming JSON request bodies.
// Without it, req.body would be undefined.
app.use(express.json());

// ---- Connect to MongoDB ----
// MONGO_URI is read from .env file. Example: mongodb://localhost:27017/studytracker
const MONGO_URI = process.env.MONGO_URI || "mongodb://projecty986_db_user:FO8fzDpGyHFO8JP6@ac-hdssnur-shard-00-00.enu1gzc.mongodb.net:27017,ac-hdssnur-shard-00-01.enu1gzc.mongodb.net:27017,ac-hdssnur-shard-00-02.enu1gzc.mongodb.net:27017/studytracker?ssl=true&replicaSet=atlas-zijg6x-shard-0&authSource=admin&appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    // ✅ Connected successfully
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    // ❌ Could not connect
    console.error("❌ MongoDB connection error:", err.message);
    console.log("👉 Make sure MongoDB is running (mongod)");
  });

// ---- Mount Routes ----
// Any request starting with /api/entries will go to entryRoutes
app.use("/api", entryRoutes);

// ---- Root Route (optional — just to test server is running) ----
app.get("/", (req, res) => {
  res.send("📚 Study Tracker API is running!");
});

// ---- Start the Server ----
// PORT is read from .env or defaults to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
