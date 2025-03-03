const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create new user; the pre-save hook in the model will hash the password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      isVerified: false, // Initially not verified
    });
    await newUser.save();

    // Optionally, send an email verification token (here we generate a JWT as an example)
    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // In production, send the verificationToken via email
    res
      .status(201)
      .json({ message: "User registered successfully", verificationToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password using the method defined on the user model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Optionally, check if email is verified before allowing login
    if (!user.isVerified) {
      return res.status(403).json({ error: "Email is not verified" });
    }

    // Generate a JWT token for the session
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password – generate a reset token
exports.forgotPassword = async (req, res) => {
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

    // In production, send this token via email to the user
    res.json({ message: "Password reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password – update the password using the reset token
exports.resetPassword = async (req, res) => {
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
exports.verifyEmail = async (req, res) => {
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

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired verification token" });
  }
};
