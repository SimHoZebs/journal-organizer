import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// POST /auth/register – Register a new user
router.post("/register", authController.register);

// POST /auth/login – Authenticate a user and return a JWT
router.post("/login", authController.login);

// POST /auth/forgot-password – Initiate the password reset process
router.post("/forgot-password", authController.forgotPassword);

// POST /auth/reset-password – Reset the user's password using a token
router.post("/reset-password", authController.resetPassword);

// GET /auth/verify-email – Verify a user's email with a token (sent via email)
router.get("/verify-email", authController.verifyEmail);

export default router;
