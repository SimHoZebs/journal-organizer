import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzleDb } from "../database/db.js";
import {
  notes,
  profiles,
  userNotes,
  userProfiles,
  users,
} from "../database/schema.js";

// Database operations (moved from models/user.js)

// Find a user by ID
export async function findById(id) {
  const result = await drizzleDb
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
}

// Find a user by email
export async function findByEmail(email) {
  const result = await drizzleDb
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] || null;
}

// Find a user by username
export async function findByUsername(username) {
  const result = await drizzleDb
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result[0] || null;
}

// Create a new user
export async function create({ username, email, password }) {
  const id = nanoid();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await drizzleDb.insert(users).values({
    id,
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    createdAt: Date.now(),
  });

  return findById(id);
}

// Update a user
export async function updateById(id, updateData) {
  await drizzleDb.update(users).set(updateData).where(eq(users.id, id));
  return findById(id);
}

// Compare password
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Get user's notes
export async function getNotes(userId) {
  const retrieved = await drizzleDb
    .select()
    .from(userNotes)
    .leftJoin(notes, eq(userNotes.noteId, notes.id))
    .where(eq(userNotes.userId, userId));

  return retrieved.map((j) => j.notes);
}

// Get user's profiles
export async function getProfiles(userId) {
  const updatedProfiles = await drizzleDb
    .select()
    .from(userProfiles)
    .leftJoin(profiles, eq(userProfiles.profileId, profiles.id))
    .where(eq(userProfiles.userId, userId));

  return updatedProfiles.map((s) => s.profiles);
}

// HTTP Request handlers

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same email or username already exists
    const existingUserByEmail = await findByEmail(email);
    const existingUserByUsername = await findByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = await create({
      username,
      email,
      password,
      isVerified: false, // Initially not verified
    });

    // Exclude password from response
    const { password: _, ...userResponse } = newUser;

    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const userList = await drizzleDb
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
      })
      .from(users);

    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the user
    const user = await findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Handle password updates separately
    const updatedFields = { ...updateData };

    if (updateData.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update user
    const updatedUser = await updateById(id, updatedFields);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    // Exclude password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    await drizzleDb.delete(users).where(eq(users.id, req.params.id));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user ID by username
export const getUserIdByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await findByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userId: user.id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: error.message });
  }
};
