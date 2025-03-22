import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

// Crie uma instância do Prisma
const prisma = new PrismaClient();

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Decorador de autenticação
  fastify.decorate("auth", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
      const userDB = await prisma.user.findUnique({
        where: {
          loginProviderId: req.user.sub
        }
      });

      // inject internal id in user object
      req.user = { ...req.user, loginProviderId: req.user.sub, id: userDB?.id ?? '' };
    } catch (err) {
      req.log.error({ error: err, message: 'Unauthorized' });
      reply.status(401).send({ error: err, message: 'Unauthorized' });
    }
  });
};

export default fp(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['@fastify/jwt'] // Indica que este plugin depende do fastify-jwt
});
