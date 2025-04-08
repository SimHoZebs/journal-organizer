import { eq, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzleDb } from "../database/db.ts";
import { noteProfiles, notes, profiles } from "../database/schema.ts";

// Database operations

// Find a profile by ID
export async function findById(id) {
  const result = await drizzleDb
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return result[0] || null;
}

// Find all profiles
export async function findAll() {
  const result = await drizzleDb.select().from(profiles);
  return result;
}

// Create a new profile
export async function create({ profileTitle, profileContent, noteIds = [] }) {
  const id = nanoid();

  // Insert the profile
  await drizzleDb.insert(profiles).values({
    id,
    profileTitle,
    profileContent,
    timeCreated: Date.now(),
    timeUpdated: Date.now(),
  });

  // Add relationships to notes if provided
  if (noteIds && noteIds.length > 0) {
    const noteRelations = noteIds.map((noteId) => ({
      id: nanoid(),
      profileId: id,
      noteId,
    }));

    await drizzleDb.insert(noteProfiles).values(noteRelations);
  }

  return findById(id);
}

// Update a profile
export async function updateById(id, updateData) {
  // Handle noteIds separately if present
  const { noteIds, ...dataToUpdate } = updateData;

  // Always update the timeUpdated field
  dataToUpdate.timeUpdated = Date.now();

  await drizzleDb.update(profiles).set(dataToUpdate).where(eq(profiles.id, id));

  // Update note relationships if provided
  if (noteIds) {
    // Delete existing relationships
    await drizzleDb.delete(noteProfiles).where(eq(noteProfiles.profileId, id));

    // Add new relationships
    if (noteIds.length > 0) {
      const noteRelations = noteIds.map((noteId) => ({
        id: nanoid(),
        profileId: id,
        noteId,
      }));

      await drizzleDb.insert(noteProfiles).values(noteRelations);
    }
  }

  return findById(id);
}

// Delete a profile
export async function deleteById(id) {
  // First delete any note relationships
  await drizzleDb.delete(noteProfiles).where(eq(noteProfiles.profileId, id));

  // Then delete the profile
  await drizzleDb.delete(profiles).where(eq(profiles.id, id));

  return { id, deleted: true };
}

// Get notes associated with a profile
export async function getNotes(profileId) {
  const noteLinks = await drizzleDb
    .select()
    .from(noteProfiles)
    .leftJoin(notes, eq(noteProfiles.noteId, notes.id))
    .where(eq(noteProfiles.profileId, profileId));

  return noteLinks
    .map((link) => {
      if (link.notes) {
        // Parse tags back to array
        return {
          ...link.notes,
          tags: JSON.parse(link.notes.tags),
        };
      }
      return null;
    })
    .filter(Boolean);
}

// HTTP Request handlers

// Create profile manually
export const createProfile = async (req, res) => {
  try {
    const { profileTitle, profileContent, noteIds } = req.body;

    if (!profileTitle || !profileContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProfile = await create({
      profileTitle,
      profileContent,
      noteIds: Array.isArray(noteIds) ? noteIds : [],
    });

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

    const profile = await findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // Make sure timeUpdated is always set
    updatedData.timeUpdated = Date.now();

    const updatedProfile = await updateById(profileId, updatedData);

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const result = await deleteById(profileId);
    if (!result.deleted) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json({ message: "Profile successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const readProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json({ message: "Profile retrieved", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const { query } = req.query;

    if (query === null || query === undefined) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const profileResults = await drizzleDb
      .select({
        id: profiles.id,
        profileTitle: profiles.profileTitle,
      })
      .from(profiles)
      .where(
        or(
          like(profiles.profileTitle, `%${query}%`),
          like(profiles.profileContent, `%${query}%`),
        ),
      );

    res.status(200).json({
      message: "Search results retrieved",
      profiles: profileResults,
    });
  } catch (error) {
    console.error("Error in searchProfiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profileResult = await drizzleDb
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1);

    if (!profileResult[0]) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Get associated notes
    const notes = await getNotes(profileId);

    const profile = {
      ...profileResult[0],
      notes,
    };

    res.status(200).json({ message: "Profile retrieved", profile });
  } catch (error) {
    console.error("Error in getProfileById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profileResults = await drizzleDb
      .select({
        id: profiles.id,
        profileTitle: profiles.profileTitle,
        timeCreated: profiles.timeCreated,
      })
      .from(profiles);

    res.status(200).json({
      message: "Profiles retrieved successfully",
      profiles: profileResults,
    });
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
