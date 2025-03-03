const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

// Define the summary schema
const summarySchema = new mongoose.Schema({
  summaryTitle: {
    type: String,
    required: true,
    trim: true,
  },
  summaryContent: {
    type: String,
    required: true,
    trim: true,
  },
  tagId: [{ type: String }],
  userId: {
    type: Number,
    required: true,
  },
  summaryId: {
    type: Number,
    required: true,
    unique: true,
  },
  timeCreated: {
    type: Date,
    default: Date.now,
  },
  timeUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Summary", summarySchema);
