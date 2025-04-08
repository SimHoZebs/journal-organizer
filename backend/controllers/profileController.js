import Profile from "../models/summary.js";

// Create profile manually
export const createProfile = async (req, res) => {
  try {
    const { profileTitle, profileContent, notebookIDs, userId } = req.body;

    if (!profileTitle || !profileContent || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProfile = new Profile({
      profileTitle,
      profileContent,
      notebookIDs: Array.isArray(notebookIDs) ? notebookIDs : [],
      userId,
    });

    await newProfile.save();
    res
      .status(200)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update profile manually
export const updateProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedData = req.body;

    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    Object.assign(profile, updatedData);
    profile.timeUpdated = Date.now();
    await profile.save();

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const deletedProfile = await Profile.findByIdAndDelete(profileId);
    if (!deletedProfile)
      return res.status(404).json({ error: "Profile not found" });
    res.status(200).json({ message: "Profile successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const readProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json({ message: "Profile retrieved", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const { userId, query } = req.query;

    if (!userId || query === null || query === undefined) {
      return res
        .status(400)
        .json({ error: "Missing userId or query parameter" });
    }

    const profiles = await Profile.find({
      userId,
      $or: [
        { profileTitle: { $regex: query, $options: "i" } },
        { profileContent: { $regex: query, $options: "i" } },
      ],
    }).select("_id profileTitle");

    res.status(200).json({ message: "Search results retrieved", profiles });
  } catch (error) {
    console.error("Error in searchProfiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { userId, profileId } = req.params;

    const profile = await Profile.findOne({ _id: profileId, userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.status(200).json({ message: "Profile retrieved", profile });
  } catch (error) {
    console.error("Error in getProfileById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ error: "Missing userId parameter" });

    const profiles = await Profile.find({ userId }).select(
      "_id profileTitle timeCreated",
    );
    res
      .status(200)
      .json({ message: "Profiles retrieved successfully", profiles });
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
