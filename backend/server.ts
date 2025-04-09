import cors from "@fastify/cors";
import Fastify from "fastify";
import noteRoutes from "./routes/note.ts";
import profileRoutes from "./routes/profile.ts";

// No need for dotenv in Deno - it has built-in env support

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

fastify.register(noteRoutes, { prefix: "/api/note" });
fastify.register(profileRoutes, { prefix: "/api/profile" });

fastify.get("/api/test", (_, reply) => {
  reply.send({ message: "Hello from the API!" });
});

const PORT = Number(Deno.env.get("PORT")) || 3000;
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    Deno.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});
