import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  resetToken: text("reset_token"),
  resetTokenExpiry: integer("reset_token_expiry"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(Date.now),
});

// Notes table
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").notNull(), // We'll store JSON stringified array
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  timeCreated: integer("time_created", { mode: "timestamp" }).default(Date.now),
  timeUpdated: integer("time_updated", { mode: "timestamp" }).default(Date.now),
});

// Profiles table (previously called profile in MongoDB)
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  profileTitle: text("profile_title").notNull(),
  profileContent: text("profile_content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  timeCreated: integer("time_created", { mode: "timestamp" }).default(Date.now),
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

// User-Note relationship table (replaces embedded arrays in MongoDB)
export const userNotes = sqliteTable("user_notes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id),
});

// User-profile relationship table (replaces embedded arrays in MongoDB)
export const userProfiles = sqliteTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id),
});
