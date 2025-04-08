import User from "../models/user.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      isVerified: false, // Initially not verified
      journalIDs: [], // Initially empty
      summaryIDs: [], // Initially empty
    });

    const savedUser = await newUser.save();
    // Exclude password from response
    const userResponse = savedUser.toObject();
    userResponse.password = undefined;
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
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const updateData = req.body;
    // Find the user
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields individually (this ensures the pre-save hook runs if password is changed)
    user.firstName = updateData.firstName || user.firstName;
    user.lastName = updateData.lastName || user.lastName;
    user.username = updateData.username || user.username;
    user.email = updateData.email || user.email;
    if (updateData.password) {
      user.password = updateData.password; // Will be hashed by the pre-save hook
    }
    if (updateData.isVerified !== undefined) {
      user.isVerified = updateData.isVerified;
    }
    if (updateData.journalIDs) {
      user.journalIDs = updateData.journalIDs;
    }
    if (updateData.summaryIDs) {
      user.summaryIDs = updateData.summaryIDs;
    }

    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    userResponse.password = undefined;
    res.json({ message: "User updated successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user ID by username
export const getUserIdByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: error.message });
  }
};
