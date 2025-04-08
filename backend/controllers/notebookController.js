import Notebook from "../models/notebook.js";
import * as profileService from "../services/profileService.js";
import mongoose from "mongoose";

export const createNotebook = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // Create a new notebook; tags are empty initially and will be updated by the profile service.
    const newNotebook = new Notebook({
      title,
      content,
      tags: [],
      userId,
    });
    await newNotebook.save();

    // Run the tag extraction and update/create profiles based on this notebook.
    await profileService.updateProfilesForNotebook(newNotebook, "create");

    res.status(200).json({
      message: "Notebook created successfully",
      notebook: newNotebook,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { title, content } = req.body;

    // Update the notebook; clear tags so they are recalculated.
    const updatedNotebook = await Notebook.findByIdAndUpdate(
      notebookId,
      { title, content, tags: [] },
      { new: true },
    );
    if (!updatedNotebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    // Re-extract tags and update associated profiles.
    await profileService.updateProfilesForNotebook(updatedNotebook, "update");

    res.status(200).json({
      message: "Notebook updated successfully",
      notebook: updatedNotebook,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;

    // Find the notebook first.
    const notebook = await Notebook.findById(notebookId);
    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    // Delete the notebook.
    await Notebook.findByIdAndDelete(notebookId);

    // Update profiles to rebuild them without this notebook.
    await profileService.updateProfilesForNotebook(notebook, "delete");

    res.status(200).json({ message: "Notebook successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const readNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const notebook = await Notebook.findById(notebookId);
    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }
    res.status(200).json({ message: "Notebook retrieved", notebook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchNotebooks = async (req, res) => {
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

export const getNotebookById = async (req, res) => {
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
export const getAllNotebooks = async (req, res) => {
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
