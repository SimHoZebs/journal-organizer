import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profileTitle: {
    type: String,
    required: true,
    trim: true,
  },
  profileContent: {
    type: String,
    required: true,
    trim: true,
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

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
