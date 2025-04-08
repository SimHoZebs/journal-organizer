import { and, eq, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzleDb } from "../database/db.js";
import { noteProfiles, notes, profiles } from "../database/schema.js";
import * as profileService from "../services/profileService.js";

// Find a note by ID
export async function findById(id) {
  const result = await drizzleDb
    .select()
    .from(notes)
    .where(eq(notes.id, id))
    .limit(1);
  if (result[0]) {
    // Parse tags back to array
    result[0].tags = JSON.parse(result[0].tags);
  }
  return result[0] || null;
}

// Find notes by user ID
export async function findByUserId(userId) {
  const result = await drizzleDb
    .select()
    .from(notes)
    .where(eq(notes.userId, userId));
  // Parse tags for each note
  return result.map((note) => {
    return {
      ...note,
      tags: JSON.parse(note.tags),
    };
  });
}

// Update a note
export async function updateById(id, updateData) {
  // Handle tags separately if present
  if (updateData.tags) {
    updateData.tags = JSON.stringify(updateData.tags);
  }

  // Always update the timeUpdated field
  updateData.timeUpdated = Date.now();

  await drizzleDb.update(notes).set(updateData).where(eq(notes.id, id));

  return findById(id);
}

// Delete a note
export async function deleteById(id) {
  // First delete any profile relationships
  await drizzleDb.delete(noteProfiles).where(eq(noteProfiles.noteId, id));

  // Then delete the note
  await drizzleDb.delete(notes).where(eq(notes.id, id));

  return { id, deleted: true };
}

// Get profiles associated with a note
export async function getProfiles(noteId) {
  const profileLinks = await drizzleDb
    .select()
    .from(noteProfiles)
    .leftJoin(profiles, eq(noteProfiles.profileId, profiles.id))
    .where(eq(noteProfiles.noteId, noteId));

  return profileLinks.map((link) => link.profiles);
}

// HTTP Request handlers

export const createNote = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // Generate a new ID for the note
    const id = nanoid();

    // Initialize empty tags array
    const parsedTags = JSON.stringify([]);

    // Insert the new note into the database
    await drizzleDb.insert(notes).values({
      id,
      title,
      content,
      tags: parsedTags,
      userId,
      timeCreated: Date.now(),
      timeUpdated: Date.now(),
    });

    // Retrieve the created note
    const newNote = await findById(id);

    // Run the tag extraction and update/create profiles based on this note.
    await profileService.updateProfilesForNote(newNote, "create");

    res.status(200).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;

    // Prepare update data with empty tags array that will be recalculated
    const updateData = {
      title,
      content,
      tags: JSON.stringify([]),
      timeUpdated: Date.now(),
    };

    // Update the note in database
    await drizzleDb.update(notes).set(updateData).where(eq(notes.id, noteId));

    // Fetch the updated note
    const updatedNote = await findById(noteId);

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Re-extract tags and update associated profiles.
    await profileService.updateProfilesForNote(updatedNote, "update");

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note first
    const note = await findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // First delete any profile relationships
    await drizzleDb.delete(noteProfiles).where(eq(noteProfiles.noteId, noteId));

    // Then delete the note
    await drizzleDb.delete(notes).where(eq(notes.id, noteId));

    // Update profiles to rebuild them without this note
    await profileService.updateProfilesForNote(note, "delete");

    res.status(200).json({ message: "Note successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const readNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find note by ID
    const result = await drizzleDb
      .select()
      .from(notes)
      .where(eq(notes.id, noteId))
      .limit(1);

    const note = result[0];
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Parse tags back to array
    note.tags = JSON.parse(note.tags);

    res.status(200).json({ message: "Note retrieved", note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { userId, query } = req.query;

    if (!userId || query === null || query === undefined) {
      return res
        .status(400)
        .json({ error: "Missing userId or query parameter" });
    }

    // With LibSQL, we need to use LIKE queries for text search
    const searchResults = await drizzleDb
      .select({ id: notes.id, title: notes.title })
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            like(notes.title, `%${query}%`),
            like(notes.content, `%${query}%`),
          ),
        ),
      );

    res.status(200).json({
      message: "Search results retrieved",
      notes: searchResults,
    });
  } catch (error) {
    console.error("Error in searchNote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({ error: "Invalid noteId" });
    }

    const note = await drizzleDb
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (!note[0]) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Parse tags from JSON string to array
    const parsedNote = {
      ...note[0],
      tags: JSON.parse(note[0].tags),
    };

    res.status(200).json({
      message: "Note retrieved",
      note: parsedNote,
    });
  } catch (error) {
    console.error("Error in getNoteById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /note/all/:userId
export const getAllNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const noteResults = await drizzleDb
      .select({
        id: notes.id,
        title: notes.title,
        timeCreated: notes.timeCreated,
      })
      .from(notes)
      .where(eq(notes.userId, userId));

    res.status(200).json({
      message: "Notes retrieved successfully",
      notes: noteResults,
    });
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
