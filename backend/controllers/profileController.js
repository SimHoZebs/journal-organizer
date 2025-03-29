const Profile = require("../models/summary");

// Helper function to check if a profile is effectively empty.
function isProfileEmpty(profile) {
  const keysToCheck = [
    "nickname",
    "birthday",
    "age",
    "occupation",
    "location",
    "education",
    "interests",
    "hobbies",
    "skills",
    "experience",
    "personalityTraits",
    "goals",
    "challenges",
    "background",
    "affiliations",
    "socialMedia",
    "favoriteBooks",
    "favoriteMovies",
    "favoriteMusic",
    "achievements",
    "family",
    "relationshipStatus",
    "memorableQuotes",
    "additionalNotes",
  ];

  for (const key of keysToCheck) {
    const value = profile[key];
    if (Array.isArray(value) && value.length > 0) {
      return false;
    } else if (key === "socialMedia" && value) {
      // Check if any social media field is non-null and non-empty.
      if (
        value.twitter ||
        value.linkedin ||
        value.facebook ||
        value.instagram
      ) {
        return false;
      }
    } else if (typeof value === "string" && value.trim() !== "") {
      return false;
    } else if (typeof value === "number" && !isNaN(value)) {
      return false;
    }
  }
  return true;
}

// Create profile manually (if needed) using the rich set of fields.
exports.createProfile = async (req, res) => {
  try {
    const {
      name,
      nickname,
      birthday,
      age,
      occupation,
      location,
      education,
      interests,
      hobbies,
      skills,
      experience,
      personalityTraits,
      goals,
      challenges,
      background,
      affiliations,
      socialMedia,
      favoriteBooks,
      favoriteMovies,
      favoriteMusic,
      achievements,
      family,
      relationshipStatus,
      memorableQuotes,
      additionalNotes,
      notebookIDs,
      userId,
    } = req.body;

    if (!name || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name and userId" });
    }

    const newProfile = new Profile({
      name,
      nickname: nickname || null,
      birthday: birthday ? new Date(birthday) : null,
      age: age || null,
      occupation: occupation || null,
      location: location || null,
      education: education || null,
      interests: Array.isArray(interests) ? interests : [],
      hobbies: Array.isArray(hobbies) ? hobbies : [],
      skills: Array.isArray(skills) ? skills : [],
      experience: experience || null,
      personalityTraits: Array.isArray(personalityTraits)
        ? personalityTraits
        : [],
      goals: goals || null,
      challenges: challenges || null,
      background: background || null,
      affiliations: Array.isArray(affiliations) ? affiliations : [],
      socialMedia: socialMedia || {
        twitter: null,
        linkedin: null,
        facebook: null,
        instagram: null,
      },
      favoriteBooks: Array.isArray(favoriteBooks) ? favoriteBooks : [],
      favoriteMovies: Array.isArray(favoriteMovies) ? favoriteMovies : [],
      favoriteMusic: Array.isArray(favoriteMusic) ? favoriteMusic : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      family: family || null,
      relationshipStatus: relationshipStatus || null,
      memorableQuotes: Array.isArray(memorableQuotes) ? memorableQuotes : [],
      additionalNotes: additionalNotes || null,
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

// Update profile manually.
// After updating, check if the profile has any meaningful content. If not, delete it.
exports.updateProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedData = req.body; // expects structured profile fields

    let profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Update profile fields.
    Object.assign(profile, updatedData);
    profile.timeUpdated = Date.now();
    await profile.save();

    // If the profile is effectively empty, delete it.
    if (isProfileEmpty(profile)) {
      await Profile.findByIdAndDelete(profileId);
      return res.status(200).json({
        message: "Profile updated but found to be empty; it has been deleted.",
      });
    }

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const deletedProfile = await Profile.findByIdAndDelete(profileId);
    if (!deletedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json({ message: "Profile successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.readProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json({ message: "Profile retrieved", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
