import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Notes table - removed userId reference since it's now single-user
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").notNull(), // We'll store JSON stringified array
  timeCreated: integer("time_created", { mode: "timestamp" }).default(Date.now),
  timeUpdated: integer("time_updated", { mode: "timestamp" }).default(Date.now),
});

// Profiles table - removed userId reference since it's now single-user
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  profileTitle: text("profile_title").notNull(),
  profileContent: text("profile_content").notNull(),
  timeCreated: integer("time_created", { mode: "timestamp" }).default(
    new Date(Date.now()),
  ),
  timeUpdated: integer("time_updated", { mode: "timestamp" }).default(Date.now),
});

// Note-Profile relationship table (replaces embedded arrays in MongoDB)
export const noteProfiles = sqliteTable("note_profiles", {
  id: text("id").primaryKey(),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});
