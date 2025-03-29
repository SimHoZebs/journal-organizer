const Profile = require("../models/summary");
const Notebook = require("../models/notebook");
const openaiService = require("./openaiService.cjs");

exports.updateProfilesForNotebook = async (notebook, operation) => {
  if (operation === "create" || operation === "update") {
    // Extract names using GPT‑4o-mini
    const namesArray = await openaiService.extractTags(notebook.content);
    notebook.tags = Array.isArray(namesArray) ? namesArray : [];
    await notebook.save();

    for (const name of notebook.tags) {
      let profile = await Profile.findOne({
        name: name,
        userId: notebook.userId,
      });

      if (profile) {
        if (!profile.notebookIDs.includes(notebook._id)) {
          profile.notebookIDs.push(notebook._id);
        }
      } else {
        profile = new Profile({
          name: name,
          userId: notebook.userId,
          notebookIDs: [notebook._id],
        });
      }

      // Retrieve all notebooks associated with this profile
      const notebooks = await Notebook.find({
        _id: { $in: profile.notebookIDs },
      });
      const notebookContents = notebooks.map((n) => n.content);

      // Create a structured profile using GPT‑4o-mini and our Zod schema
      const profileData = await openaiService.createProfile(
        name,
        notebookContents,
      );
      if (profileData) {
        profile.name = profileData.name || profile.name;

        profile.nickname = profileData.nickname || null;

        // Parse birthday safely.
        if (profileData.birthday) {
          const parsedBirthday = new Date(profileData.birthday);
          profile.birthday = isNaN(parsedBirthday.getTime())
            ? null
            : parsedBirthday;
        } else {
          profile.birthday = null;
        }

        profile.age = profileData.age || null;
        profile.occupation = profileData.occupation || null;
        profile.location = profileData.location || null;
        profile.education = profileData.education || null;
        profile.interests = Array.isArray(profileData.interests)
          ? profileData.interests
          : [];
        profile.hobbies = Array.isArray(profileData.hobbies)
          ? profileData.hobbies
          : [];
        profile.skills = Array.isArray(profileData.skills)
          ? profileData.skills
          : [];
        profile.experience = profileData.experience || null;
        profile.personalityTraits = Array.isArray(profileData.personalityTraits)
          ? profileData.personalityTraits
          : [];
        profile.goals = profileData.goals || null;
        profile.challenges = profileData.challenges || null;
        profile.background = profileData.background || null;
        profile.affiliations = Array.isArray(profileData.affiliations)
          ? profileData.affiliations
          : [];
        profile.socialMedia = profileData.socialMedia || {
          twitter: null,
          linkedin: null,
          facebook: null,
          instagram: null,
        };
        profile.favoriteBooks = Array.isArray(profileData.favoriteBooks)
          ? profileData.favoriteBooks
          : [];
        profile.favoriteMovies = Array.isArray(profileData.favoriteMovies)
          ? profileData.favoriteMovies
          : [];
        profile.favoriteMusic = Array.isArray(profileData.favoriteMusic)
          ? profileData.favoriteMusic
          : [];
        profile.achievements = Array.isArray(profileData.achievements)
          ? profileData.achievements
          : [];
        profile.family = profileData.family || null;
        profile.relationshipStatus = profileData.relationshipStatus || null;
        profile.memorableQuotes = Array.isArray(profileData.memorableQuotes)
          ? profileData.memorableQuotes
          : [];
        profile.additionalNotes = profileData.additionalNotes || null;
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
          profile.name,
          notebookContents,
        );
        if (profileData) {
          profile.name = profileData.name || profile.name;
          profile.nickname = profileData.nickname || null;
          if (profileData.birthday) {
            const parsedBirthday = new Date(profileData.birthday);
            profile.birthday = isNaN(parsedBirthday.getTime())
              ? null
              : parsedBirthday;
          } else {
            profile.birthday = null;
          }
          profile.age = profileData.age || null;
          profile.occupation = profileData.occupation || null;
          profile.location = profileData.location || null;
          profile.education = profileData.education || null;
          profile.interests = Array.isArray(profileData.interests)
            ? profileData.interests
            : [];
          profile.hobbies = Array.isArray(profileData.hobbies)
            ? profileData.hobbies
            : [];
          profile.skills = Array.isArray(profileData.skills)
            ? profileData.skills
            : [];
          profile.experience = profileData.experience || null;
          profile.personalityTraits = Array.isArray(
            profileData.personalityTraits,
          )
            ? profileData.personalityTraits
            : [];
          profile.goals = profileData.goals || null;
          profile.challenges = profileData.challenges || null;
          profile.background = profileData.background || null;
          profile.affiliations = Array.isArray(profileData.affiliations)
            ? profileData.affiliations
            : [];
          profile.socialMedia = profileData.socialMedia || {
            twitter: null,
            linkedin: null,
            facebook: null,
            instagram: null,
          };
          profile.favoriteBooks = Array.isArray(profileData.favoriteBooks)
            ? profileData.favoriteBooks
            : [];
          profile.favoriteMovies = Array.isArray(profileData.favoriteMovies)
            ? profileData.favoriteMovies
            : [];
          profile.favoriteMusic = Array.isArray(profileData.favoriteMusic)
            ? profileData.favoriteMusic
            : [];
          profile.achievements = Array.isArray(profileData.achievements)
            ? profileData.achievements
            : [];
          profile.family = profileData.family || null;
          profile.relationshipStatus = profileData.relationshipStatus || null;
          profile.memorableQuotes = Array.isArray(profileData.memorableQuotes)
            ? profileData.memorableQuotes
            : [];
          profile.additionalNotes = profileData.additionalNotes || null;
        }
        profile.timeUpdated = Date.now();
        await profile.save();
      }
    }
  }
};
