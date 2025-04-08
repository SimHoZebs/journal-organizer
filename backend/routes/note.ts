import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  readNote,
  searchNotes,
  updateNote,
} from "../controllers/noteController";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // Register the authenticate hook for all routes
  fastify.post("/create-note", createNote);
  fastify.put("/update-note/:noteId", updateNote);
  fastify.delete("/delete-note/:noteId", deleteNote);
  fastify.get("/read-note/:noteId", readNote);
  fastify.get("/search", searchNotes);
  fastify.get("/all/:userId", getAllNotes);
  fastify.get("/:userId/:noteId", getNoteById);
}
