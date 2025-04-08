import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/libsql";

import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create a LibSQL client using environment variables or default to a local SQLite file
export const db = createClient({
  url: process.env.LIBSQL_URL || "file:note-organizer.db",
  authToken: process.env.LIBSQL_AUTH_TOKEN,
});
// Create Drizzle ORM instance
export const drizzleDb = drizzle(db);

export async function verifyPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

// More helper functions can be added as needed
