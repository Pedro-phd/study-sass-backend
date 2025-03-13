import { FastifyInstance } from "fastify";

export const userRoutes = async (server: FastifyInstance) => {

  server.get('/', {}, async (request, reply) => {
    return reply.send('opa');
  });
};