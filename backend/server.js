// server.js
require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth"); // Import the auth routes
const journalRoutes = require("./routes/journal"); 

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// Connect to MongoDB using your connection string from .env
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount auth routes at /auth
app.use("/auth", authRoutes);
app.use("/journal", journalRoutes);

// A simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);

// // CODE TESTING THE API BACK END
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3001;

// // Simple API endpoint
// app.get('/api/test', (req, res) => {
//     res.json({ message: "Hello from the API!" });
// });

// app.listen(PORT, () => {
//     console.log(`Backend API running on port ${PORT}`);
// });

// server.js
// server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// app.use(express.json()); // Parse JSON request bodies

// // Connection string from the environment variables
// const mongoURI = process.env.MONGO_URI;
// console.log(mongoURI);
// // Function to start the server
// function startServer() {
//     // Define a simple schema and model for a "Message"
//     const messageSchema = new mongoose.Schema({
//         text: String,
//         createdAt: { type: Date, default: Date.now }
//     });

//     const Message = mongoose.model('Message', messageSchema);

//     // Endpoint to write a message to the database
//     app.post('/api/messages', async (req, res) => {
//         // Check if DB connection is established
//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ error: "Database connection is not established" });
//         }
//         try {
//             const { text } = req.body;
//             if (!text) return res.status(400).json({ error: "Text is required" });

//             const message = new Message({ text });
//             await message.save();
//             res.status(201).json({ message: "Message saved", data: message });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     });

//     // Endpoint to read messages from the database
//     app.get('/api/messages', async (req, res) => {
//         // Check if DB connection is established
//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ error: "Database connection is not established" });
//         }
//         try {
//             const messages = await Message.find().sort({ createdAt: -1 });
//             res.json({ messages });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     });

//     // A simple test endpoint that doesn't require the DB
//     app.get('/api/test', (req, res) => {
//         res.json({ message: "Hello from the API!" });
//     });

//     // Start the Express server
//     const PORT = process.env.PORT || 3001;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// // Connect to MongoDB with Mongoose
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Connected to MongoDB");
//         startServer();
//     })
//     .catch(err => {
//         console.error("MongoDB connection error:", err);
//         // Option: exit process if DB connection is essential
//         // process.exit(1);
//         // Instead, we start the server so that endpoints return an error message if DB isn't available:
//         startServer();
//     });
