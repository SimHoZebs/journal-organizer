const mongoose = require("mongoose");

// Define the Notebook schema
const notebookSchema = new mongoose.Schema({
  notebookId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [{ type: String, trim: true }],

  userId: {
    type: Number,
    required: true,
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

module.exports = mongoose.model("Notebook", notebookSchema);
