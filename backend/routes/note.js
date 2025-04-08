import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/noteController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create-note", authenticateToken, createNote);
router.put("/update-note/:noteId", authenticateToken, updateNote);
router.delete("/delete-note/:noteId", authenticateToken, deleteNote);
router.get("/read-note/:noteId", authenticateToken, readNote);
router.get("/search", authenticateToken, searchNotes);
router.get("/all/:userId", authenticateToken, getAllNotes);
router.get("/:userId/:noteId", authenticateToken, getNoteById);

export default router;
