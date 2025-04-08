import { and, eq, inArray, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzleDb } from "../database/db.js";
import { noteProfiles, notes, profiles } from "../database/schema.js";
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

export const updateProfilesForNote = async (note, operation) => {
  if (operation === "create" || operation === "update") {
    const namesArray = await openaiService.extractTags(note.content);

    // Update note tags directly
    const tagsJson = JSON.stringify(
      Array.isArray(namesArray) ? namesArray : [],
    );
    await drizzleDb
      .update(notes)
      .set({
        tags: tagsJson,
        timeUpdated: Date.now(),
      })
      .where(eq(notes.id, note.id));

    // Get the updated note with parsed tags
    const result = await drizzleDb
      .select()
      .from(notes)
      .where(eq(notes.id, note.id))
      .limit(1);
    const updatedNote = result[0];
    updatedNote.tags = JSON.parse(updatedNote.tags);

    const updatedProfiles = new Set();

    for (const name of updatedNote.tags) {
      const normalized = name.trim().toLowerCase();
      if (updatedProfiles.has(normalized)) {
        continue;
      }
      updatedProfiles.add(normalized);

      // Find profile by name (case-insensitive)
      const profileResult = await drizzleDb
        .select()
        .from(profiles)
        .where(
          and(
            eq(profiles.userId, note.userId),
            like(profiles.profileTitle, normalized),
          ),
        )
        .limit(1);

      const profile = profileResult[0];
      let profileId;

      if (profile) {
        profileId = profile.id;

        // Check if note is already associated with profile
        const existingRelation = await drizzleDb
          .select()
          .from(noteProfiles)
          .where(
            and(
              eq(noteProfiles.profileId, profileId),
              eq(noteProfiles.noteId, note.id),
            ),
          )
          .limit(1);

        // If no relation exists, create one
        if (!existingRelation[0]) {
          await drizzleDb.insert(noteProfiles).values({
            id: nanoid(),
            profileId,
            noteId: note.id,
          });
        }
      } else {
        // Create new profile
        profileId = nanoid();
        await drizzleDb.insert(profiles).values({
          id: profileId,
          profileTitle: name.trim(),
          profileContent: "",
          userId: note.userId,
          timeCreated: Date.now(),
          timeUpdated: Date.now(),
        });

        // Create relation to note
        await drizzleDb.insert(noteProfiles).values({
          id: nanoid(),
          profileId,
          noteId: note.id,
        });
      }

      // Get all notes associated with this profile
      const noteLinks = await drizzleDb
        .select({ noteId: noteProfiles.noteId })
        .from(noteProfiles)
        .where(eq(noteProfiles.profileId, profileId));

      const noteIds = noteLinks.map((link) => link.noteId);

      // Get note contents
      const noteResults = await drizzleDb
        .select()
        .from(notes)
        .where(inArray(notes.id, noteIds));

      const noteContents = noteResults.map((n) => n.content);

      // Update profile data
      const profileData = await openaiService.createProfile(name, noteContents);

      if (profileData) {
        await drizzleDb
          .update(profiles)
          .set({
            profileTitle: profileData.name?.trim() || name.trim(),
            profileContent: formatProfileContent(profileData),
            timeUpdated: Date.now(),
          })
          .where(eq(profiles.id, profileId));
      }
    }
  } else if (operation === "delete") {
    // Find profiles associated with this note
    const profileLinks = await drizzleDb
      .select({ profileId: noteProfiles.profileId })
      .from(noteProfiles)
      .where(eq(noteProfiles.noteId, note.id));

    // Delete note-profile relationships
    await drizzleDb
      .delete(noteProfiles)
      .where(eq(noteProfiles.noteId, note.id));

    // For each profile, check if it has other notes
    for (const { profileId } of profileLinks) {
      const remainingLinks = await drizzleDb
        .select()
        .from(noteProfiles)
        .where(eq(noteProfiles.profileId, profileId));

      if (remainingLinks.length === 0) {
        // If profile has no more notes, delete it
        await drizzleDb.delete(profiles).where(eq(profiles.id, profileId));
      } else {
        // Otherwise, update profile data based on remaining notes
        const noteIds = remainingLinks.map((link) => link.noteId);

        const noteResults = await drizzleDb
          .select()
          .from(notes)
          .where(inArray(notes.id, noteIds));

        const noteContents = noteResults.map((n) => n.content);

        const profileResult = await drizzleDb
          .select()
          .from(profiles)
          .where(eq(profiles.id, profileId))
          .limit(1);

        const profile = profileResult[0];

        const profileData = await openaiService.createProfile(
          profile.profileTitle,
          noteContents,
        );

        if (profileData) {
          await drizzleDb
            .update(profiles)
            .set({
              profileTitle: profileData.name?.trim() || profile.profileTitle,
              profileContent: formatProfileContent(profileData),
              timeUpdated: Date.now(),
            })
            .where(eq(profiles.id, profileId));
        }
      }
    }
  }
};
