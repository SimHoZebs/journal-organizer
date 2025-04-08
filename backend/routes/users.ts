import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../controllers/userController";
import authenticateToken from "../services/authenticateToken";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // Routes that require authentication
  fastify.get(
    "/:id",
    { preHandler: authenticateToken },
    userController.getUserById,
  );
  fastify.put(
    "/:id",
    { preHandler: authenticateToken },
    userController.updateUser,
  );
  fastify.delete(
    "/:id",
    { preHandler: authenticateToken },
    userController.deleteUser,
  );
}
