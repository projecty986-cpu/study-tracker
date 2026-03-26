/* =============================================
   TODAY I LEARNED — STUDY TRACKER
   Routes: routes/entryRoutes.js
   ============================================= */

// Import Express and create a Router
// Router = a mini-app that handles specific routes
const express = require("express");
const router  = express.Router();

// Import our Entry model (the database blueprint)
const Entry = require("../models/Entry");

// =============================================
// ROUTE 1: POST /api/entries
// =============================================
// PURPOSE: Save study items for a specific date.
// - If the date already has an entry → ADD new items to it (don't duplicate)
// - If the date is new → CREATE a new entry
//
// REQUEST BODY (what the frontend sends):
// { "date": "2026-03-24", "items": ["Learned JS", "Studied math"] }

router.post("/entries", async (req, res) => {
  try {
    // Extract date and items from the request body
    const { date, items } = req.body;

    // ---- Validate inputs ----
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array." });
    }

    // ---- Check if an entry for this date already exists ----
    let existingEntry = await Entry.findOne({ date: date });

    if (existingEntry) {
      // ✅ Entry EXISTS → Add new items to the existing array
      // $push with $each: adds multiple items to the array at once
      existingEntry = await Entry.findOneAndUpdate(
        { date: date },                          // find by date
        { $push: { items: { $each: items } } }, // add all new items
        { new: true }                            // return the updated document
      );

      return res.status(200).json({
        message: "Items added to existing entry.",
        entry: existingEntry
      });

    } else {
      // ✅ Entry DOES NOT EXIST → Create a new one
      const newEntry = new Entry({
        date: date,
        items: items
      });

      await newEntry.save(); // Save to MongoDB

      return res.status(201).json({
        message: "New entry created.",
        entry: newEntry
      });
    }

  } catch (err) {
    // Something unexpected went wrong
    console.error("POST /entries error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// =============================================
// ROUTE 2: GET /api/entries/:date
// =============================================
// PURPOSE: Get all study items for a specific date.
// :date is a URL parameter — e.g. GET /api/entries/2026-03-24
//
// RESPONSE:
// { date: "2026-03-24", items: ["Learned JS", "Studied math"], ... }
// OR null if no entry found

router.get("/entries/:date", async (req, res) => {
  try {
    // req.params.date = the date from the URL (e.g. "2026-03-24")
    const { date } = req.params;

    // Find the entry in MongoDB
    const entry = await Entry.findOne({ date: date });

    if (!entry) {
      // No entry found — return 404 with a message
      return res.status(404).json({ message: "No entry found for this date.", items: [] });
    }

    // Return the entry
    return res.status(200).json(entry);

  } catch (err) {
    console.error("GET /entries/:date error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// =============================================
// ROUTE 3: GET /api/entries
// =============================================
// PURPOSE: Get ALL entries (used to show all saved dates in the list).
//
// RESPONSE:
// [ { date: "...", items: [...] }, { date: "...", items: [...] }, ... ]

router.get("/entries", async (req, res) => {
  try {
    // Find all documents in the entries collection
    // .sort({ date: -1 }) = newest date first
    const entries = await Entry.find().sort({ date: -1 });

    return res.status(200).json(entries);

  } catch (err) {
    console.error("GET /entries error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ---- Export the router ----
module.exports = router;
