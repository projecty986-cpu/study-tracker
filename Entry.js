/* =============================================
   TODAY I LEARNED — STUDY TRACKER
   Database Model: models/Entry.js
   ============================================= */

// Import mongoose
const mongoose = require("mongoose");

// ---- Define the Schema ----
// A Schema is like a blueprint — it defines what shape each document
// (record) in the MongoDB collection should have.
//
// Our Entry document looks like this:
// {
//   date: "2026-03-24",
//   items: ["Learned JavaScript arrays", "Studied biology"],
//   createdAt: <Date>
// }

const entrySchema = new mongoose.Schema({

  // `date` is a string in "YYYY-MM-DD" format.
  // We use a string (not Date type) to keep things simple and avoid timezone issues.
  date: {
    type: String,
    required: true,  // Every entry MUST have a date
    unique: true     // No two documents can have the same date
  },

  // `items` is an array of strings — each string is one study item.
  items: {
    type: [String],  // An array of strings
    default: []      // Default is an empty array
  },

  // `createdAt` records when this entry was first created.
  createdAt: {
    type: Date,
    default: Date.now  // Auto-set to current date/time
  }

});

// ---- Create the Model ----
// A Model is a class that lets us create, read, update, and delete documents
// in the "entries" collection in MongoDB.
// ("Entry" → Mongoose automatically creates a collection called "entries")
const Entry = mongoose.model("Entry", entrySchema);

// ---- Export the Model ----
// We export it so other files (like our routes) can use it.
module.exports = Entry;
