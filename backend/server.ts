import cors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";
import noteRoutes from "./routes/note.ts";
import profileRoutes from "./routes/profile.ts";

// Load environment variables
dotenv.config({ path: "../.env" });

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

fastify.register(noteRoutes, { prefix: "/api/note" });
fastify.register(profileRoutes, { prefix: "/api/profile" });

fastify.get("/api/test", (_, reply) => {
  reply.send({ message: "Hello from the API!" });
});

const PORT = Number.parseInt(Deno.env.get("PORT") || "") || 3000;
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    Deno.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});
