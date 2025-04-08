import cors from "cors";
// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"; // Note the .js extension
import journalRoutes from "./routes/journal.js";
import profileRoutes from "./routes/profile.js";
import userRoutes from "./routes/users.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB using your connection string from .env
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount auth routes at /auth
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
// A simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
