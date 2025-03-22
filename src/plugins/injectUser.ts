import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

// Crie uma instância do Prisma
const prisma = new PrismaClient();

const injectUserPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Decorador de autenticação
  fastify.decorate("injectUser", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userDB = await prisma.user.findUnique({
        where: {
          loginProviderId: req.user.sub
        }
      });

      // inject internal id in user object
      req.user = { ...req.user, loginProviderId: req.user.sub, id: userDB?.id ?? '' };
    } catch (err) {
      req.log.error({ error: err, message: 'Error on inject user in req' });
      reply.status(401).send({ error: err, message: 'Error on inject user in req' });
    }
  });
};

export default fp(injectUserPlugin, {
  name: 'inject-user',
  dependencies: ['@fastify/jwt'] // Indica que este plugin depende do fastify-jwt
});
