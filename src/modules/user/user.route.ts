import { FastifyInstance } from "fastify";

export const userRoutes = async (server: FastifyInstance) => {

  server.get('/', {}, async (request, reply) => {
    const users = await server.prisma.user.findMany();
    return reply.send(users);
  });
};