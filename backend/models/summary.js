const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    default: null,
  },
  birthday: {
    type: Date,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  occupation: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  education: {
    type: String,
    default: null,
  },
  interests: {
    type: [String],
    default: [],
  },
  hobbies: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    default: null,
  },
  personalityTraits: {
    type: [String],
    default: [],
  },
  goals: {
    type: String,
    default: null,
  },
  challenges: {
    type: String,
    default: null,
  },
  background: {
    type: String,
    default: null,
  },
  affiliations: {
    type: [String],
    default: [],
  },
  socialMedia: {
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null },
    facebook: { type: String, default: null },
    instagram: { type: String, default: null },
  },
  favoriteBooks: {
    type: [String],
    default: [],
  },
  favoriteMovies: {
    type: [String],
    default: [],
  },
  favoriteMusic: {
    type: [String],
    default: [],
  },
  achievements: {
    type: [String],
    default: [],
  },
  family: {
    type: String,
    default: null,
  },
  relationshipStatus: {
    type: String,
    default: null,
  },
  memorableQuotes: {
    type: [String],
    default: [],
  },
  additionalNotes: {
    type: String,
    default: null,
  },
  notebookIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

module.exports = mongoose.model("Profile", profileSchema);
