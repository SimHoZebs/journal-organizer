import Notebook from "../models/notebook.js";
import Profile from "../models/summary.js";
import * as openaiService from "./openaiService.js";

function formatProfileContent(data) {
  const formatField = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null"
    ) {
      return "N/A";
    }
    return String(value);
  };

  const formatArray = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "N/A";

  const formatQuotes = (arr) =>
    Array.isArray(arr) && arr.filter((v) => v && v !== "null").length > 0
      ? `- ${arr.filter((v) => v && v !== "null").join("\n- ")}`
      : "N/A";

  return `Name: ${formatField(data.name)}
Nickname: ${formatField(data.nickname)}
Birthday: ${formatField(data.birthday)}
Age: ${formatField(data.age)}
Occupation: ${formatField(data.occupation)}
Location: ${formatField(data.location)}
Education: ${formatField(data.education)}
Interests: ${formatArray(data.interests)}
Hobbies: ${formatArray(data.hobbies)}
Skills: ${formatArray(data.skills)}
Experience: ${formatField(data.experience)}
Personality Traits: ${formatArray(data.personalityTraits)}
Goals: ${formatField(data.goals)}
Challenges: ${formatField(data.challenges)}
Background: ${formatField(data.background)}
Affiliations: ${formatArray(data.affiliations)}
Favorite Books: ${formatArray(data.favoriteBooks)}
Favorite Movies: ${formatArray(data.favoriteMovies)}
Favorite Music: ${formatArray(data.favoriteMusic)}
Achievements: ${formatArray(data.achievements)}
Family: ${formatField(data.family)}
Relationship Status: ${formatField(data.relationshipStatus)}
Memorable Quotes: ${formatQuotes(data.memorableQuotes)}
Additional Notes: ${formatField(data.additionalNotes)}`;
}

export const updateProfilesForNotebook = async (notebook, operation) => {
  if (operation === "create" || operation === "update") {
    const namesArray = await openaiService.extractTags(notebook.content);
    notebook.tags = Array.isArray(namesArray) ? namesArray : [];
    await notebook.save();

    const updatedProfiles = new Set();

    for (const name of notebook.tags) {
      const normalized = name.trim().toLowerCase();
      if (updatedProfiles.has(normalized)) {
        continue;
      }
      updatedProfiles.add(normalized);

      let profile = await Profile.findOne({
        profileTitle: { $regex: new RegExp(`^${normalized}$`, "i") },
        userId: notebook.userId,
      });

      if (profile) {
        if (
          !profile.notebookIDs.some(
            (id) => id.toString() === notebook._id.toString(),
          )
        ) {
          profile.notebookIDs.push(notebook._id);
        }
      } else {
        profile = new Profile({
          profileTitle: name.trim(),
          userId: notebook.userId,
          notebookIDs: [notebook._id],
        });
      }

      const notebooks = await Notebook.find({
        _id: { $in: profile.notebookIDs },
      });
      const notebookContents = notebooks.map((n) => n.content);

      const profileData = await openaiService.createProfile(
        name,
        notebookContents,
      );
      if (profileData) {
        profile.profileTitle = profileData.name?.trim() || profile.profileTitle;
        profile.profileContent = formatProfileContent(profileData);
      }
      profile.timeUpdated = Date.now();
      await profile.save();
    }
  } else if (operation === "delete") {
    const profiles = await Profile.find({ notebookIDs: notebook._id });
    for (const profile of profiles) {
      profile.notebookIDs = profile.notebookIDs.filter(
        (id) => id.toString() !== notebook._id.toString(),
      );

      if (profile.notebookIDs.length === 0) {
        await Profile.findByIdAndDelete(profile._id);
      } else {
        const notebooks = await Notebook.find({
          _id: { $in: profile.notebookIDs },
        });
        const notebookContents = notebooks.map((n) => n.content);
        const profileData = await openaiService.createProfile(
          profile.profileTitle,
          notebookContents,
        );
        if (profileData) {
          profile.profileTitle =
            profileData.name?.trim() || profile.profileTitle;
          profile.profileContent = formatProfileContent(profileData);
        }
        profile.timeUpdated = Date.now();
        await profile.save();
      }
    }
  }
};
