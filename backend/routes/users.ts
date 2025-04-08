import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/", userController.createUser);

// Get all users
router.get("/", userController.getAllUsers);

// Get user ID by username (specific route must come before generic /:id route)
router.get("/id/:username", userController.getUserIdByUsername);

// Get a user by ID
router.get("/:id", userController.getUserById);

// Update a user by ID
router.put("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
