import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { and, eq, gt } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { drizzleDb } from "../database/db.js";
import { users } from "../database/schema.js";
import resetPasswordEmailTemplate from "../services/emailTemplates/resetPasswordEmail.js";
import verificationEmailTemplate from "../services/emailTemplates/verificationEmail.js";
import sendEmail from "../services/sendEmail.js";
import * as User from "./userController.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same email or username already exists
    const existingUserByEmail = await User.findByEmail(email);
    const existingUserByUsername = await User.findByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      isVerified: false, // Initially not verified
    });

    // Generate an email verification token (JWT) that expires in 1 day
    const verificationToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

    // Use the verification email template
    const emailContent = verificationEmailTemplate(verificationLink);

    await sendEmail(
      newUser.email,
      "Verify Your Journal Organizer Account",
      emailContent,
    );
    res.status(201).json({
      message:
        "User registered successfully. Please check email for verification.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Allow login by email OR username
    let user = null;
    if (email) {
      user = await User.findByEmail(email);
    } else if (username) {
      user = await User.findByUsername(username);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if email is verified before allowing login
    if (!user.isVerified) {
      return res.status(403).json({ error: "Email is not verified" });
    }

    // Generate a JWT token for the session that expires in 1 hour
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password – generate a reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token (a random string)
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Set token expiry to 1 hour from now
    await User.updateById(user.id, {
      resetToken,
      resetTokenExpiry: Date.now() + 3600000,
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Use the password reset email template
    const resetContent = resetPasswordEmailTemplate(resetLink);

    await sendEmail(
      user.email,
      "Reset Your Journal Organizer Password",
      resetContent,
    );

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password – update the password using the reset token
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Find the user with a valid reset token
    const result = await drizzleDb
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetToken, resetToken),
          gt(users.resetTokenExpiry, Date.now()),
        ),
      )
      .limit(1);

    const user = result[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    await User.updateById(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Email – mark the user's email as verified using a token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    // Verify token (assuming the verification token is a JWT containing the user ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mark email as verified
    await User.updateById(user.id, { isVerified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired verification token" });
  }
};
