import type { FastifyInstance } from "fastify";

export const userRoutes = async (server: FastifyInstance) => {

  server.get('/', {
    onRequest: [server.auth],
    schema: {
      security: [
        { bearerAuth: [] }
      ]
    }
  }, async (req, reply) => {
    return reply.send(req.user);
  });
};