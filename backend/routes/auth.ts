import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authenticateToken from "../services/authenticateToken";
import {
  login,
  logout,
  register,
  validate,
} from "../controllers/authController";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  // Public routes that don't require authentication
  fastify.post("/login", login);
  fastify.post("/register", register);

  // Routes that require authentication
  fastify.post("/logout", { preHandler: authenticateToken }, logout);
  fastify.get("/validate", { preHandler: authenticateToken }, validate);
}
