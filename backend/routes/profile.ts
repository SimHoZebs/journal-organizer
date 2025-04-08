import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as profileController from "../controllers/profileController.ts";
import authenticateToken from "../services/authenticateToken.ts";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // Public routes that don't require authentication
  fastify.get("/search", profileController.searchProfiles);

  // Routes that require authentication
  fastify.post(
    "/create-profile",
    { preHandler: authenticateToken },
    profileController.createProfile,
  );
  fastify.delete(
    "/delete-profile/:profileId",
    { preHandler: authenticateToken },
    profileController.deleteProfile,
  );
  fastify.put(
    "/update-profile/:profileId",
    { preHandler: authenticateToken },
    profileController.updateProfile,
  );
  fastify.get(
    "/read-profile/:profileId",
    { preHandler: authenticateToken },
    profileController.readProfile,
  );
  fastify.get(
    "/all/:userId",
    { preHandler: authenticateToken },
    profileController.getAllProfiles,
  );
  fastify.get(
    "/:userId/:profileId",
    { preHandler: authenticateToken },
    profileController.getProfileById,
  );
}
