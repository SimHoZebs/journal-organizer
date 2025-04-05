const Notebook = require("../models/notebook");

exports.createNotebook = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // TODO openAI generated tags here
    const tags = ["name", "sample", "tags"];

    // Create a new notebook
    const newNotebook = new Notebook({
      title,
      content,
      tags,
      userId,
    });
    await newNotebook.save();

    res.status(200).json({
      message: "Notebook created successfully",
      notebook: newNotebook,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notebook by ID
exports.deleteNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;

    // Find and delete the notebook
    const deletedNotebook = await Notebook.findByIdAndDelete(notebookId);
    if (!deletedNotebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    res.status(200).json({ message: "Notebook successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a notebook by ID
exports.updateNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { title, content } = req.body;

    // TODO openAI generated tags here
    const tags = ["name", "sample", "tags"];

    // Find and update the notebook
    const updatedNotebook = await Notebook.findByIdAndUpdate(
      notebookId,
      { title, content, tags },
      { new: true },
    );
    if (!updatedNotebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    res.status(200).json({
      message: "Notebook updated successfully",
      notebook: updatedNotebook,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a notebook by ID
exports.readNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;

    // Find the notebook
    const notebook = await Notebook.findById(notebookId);
    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    res.status(200).json({ message: "Notebook retrieved", notebook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchNotebooks = async (req, res) => {
  try {
    const { userId, query } = req.query;

    if (!userId || query === null || query === undefined) {
      return res
        .status(400)
        .json({ error: "Missing userId or query parameter" });
    }

    const notebooks = await Notebook.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).select("_id title");

    res.status(200).json({
      message: "Search results retrieved",
      notebooks,
    });
  } catch (error) {
    console.error("Error in searchNotebook:", error);
    res.status(500).json({ error: "Internal server error" }); // Generic server error
  }
};

exports.getNotebookById = async (req, res) => {
  try {
    const { userId, notebookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notebookId)) {
      return res.status(400).json({ error: "Invalid notebookId" });
    }

    const notebook = await Notebook.findOne({
      _id: notebookId,
      userId,
    });

    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    res.status(200).json({
      message: "Notebook retrieved",
      notebook,
    });
  } catch (error) {
    console.error("Error in getNotebookById:", error);
    res.status(500).json({ error: "Internal server error" }); // Generic server error
  }
};

// GET /notebook/all/:userId
exports.getAllNotebooks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const notebooks = await Notebook.find({ userId }).select(
      "_id title timeCreated",
    );

    res.status(200).json({
      message: "Notebooks retrieved successfully",
      notebooks,
    });
  } catch (error) {
    console.error("Error in getAllNotebooks:", error);
    res.status(500).json({ error: "Internal server error" }); // Generic server error
  }
};
