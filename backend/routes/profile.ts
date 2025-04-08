import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as profileController from "../controllers/profileController.ts";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  fastify.get("/search", profileController.searchProfiles);
  fastify.post("/create-profile", profileController.createProfile);
  fastify.delete("/delete-profile/:profileId", profileController.deleteProfile);
  fastify.put("/update-profile/:profileId", profileController.updateProfile);
  fastify.get("/read-profile/:profileId", profileController.readProfile);
  fastify.get("/all", profileController.getAllProfiles);
  fastify.get("/:profileId", profileController.getProfileById);
}
