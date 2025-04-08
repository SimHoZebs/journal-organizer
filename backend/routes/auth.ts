import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as authController from "../controllers/authController";
import authenticateToken from "../services/authenticateToken";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // Public routes that don't require authentication
  fastify.post("/login", authController.login);
  fastify.post("/register", authController.register);

  // Routes that require authentication
  fastify.post(
    "/logout",
    { preHandler: authenticateToken },
    authController.logout,
  );
  fastify.get(
    "/validate",
    { preHandler: authenticateToken },
    authController.validate,
  );
}
