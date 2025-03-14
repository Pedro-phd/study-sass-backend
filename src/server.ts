import fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt, { FastifyJWT } from '@fastify/jwt'

import { healthcheckRoutes } from '@/routes/healthcheck';
import { userRoutes } from './modules/user/user.route';

export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Register plugins
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? '' ,
  })

  server.addHook('preHandler', (req, _, next) => { 
    req.jwt = server.jwt 
    return next() 
  })

  server.decorate("auth", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      req.log.error({ error: err, message: 'Unauthorized' })
      reply.status(401).send({ error: err, message: 'Unauthorized' })
    }
  });

  // Swagger documentation
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Clean Architecture API',
        description: 'API documentation with Swagger',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'users', description: 'User related end-points' },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Insira o token JWT com o prefixo Bearer'
        }
      }
    },
  });
  
  await server.register(swaggerUi, {
    routePrefix: '/docs'
  });

  // Register routes
  await server.register(healthcheckRoutes, { prefix: '/health' });
  await server.register(userRoutes, { prefix: '/users' });


  return server;
}