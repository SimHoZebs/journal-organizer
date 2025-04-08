import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import resetPasswordEmailTemplate from "../services/emailTemplates/resetPasswordEmail.js";
import verificationEmailTemplate from "../services/emailTemplates/verificationEmail.js";
import sendEmail from "../services/sendEmail.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create a new user; the pre-save hook in the model will hash the password
    const newUser = new User({
      username,
      email,
      password,
      //SET TO FALSE LATER
      isVerified: false, // Initially not verified
      journalIDs: [], // Empty array for journal IDs
      summaryIDs: [], // Empty array for summary IDs
    });
    await newUser.save();

    // Generate an email verification token (JWT) that expires in 1 day
    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

    // Use the new verification email template
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
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password using the method defined on the user model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if email is verified before allowing login
    if (!user.isVerified) {
      return res.status(403).json({ error: "Email is not verified" });
    }

    // Generate a JWT token for the session that expires in 1 hour
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id, // Include userId here
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password – generate a reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token (a random string)
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Set token expiry to 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Use the new password reset email template
    const resetContent = resetPasswordEmailTemplate(resetLink);

    await sendEmail(
      user.email,
      "Reset Your Journal Organizer Password",
      resetContent,
    );

    // In production, send this token via email to the user
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
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Update password; the pre-save hook will hash it
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

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
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired verification token" });
  }
};
