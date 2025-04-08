import cors from "cors";
// server.js
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.js"; // Note the .js extension
import noteRoutes from "./routes/note.js";
import profileRoutes from "./routes/profile.js";
import userRoutes from "./routes/users.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(cors());

// Mount auth routes at /auth
app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

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
