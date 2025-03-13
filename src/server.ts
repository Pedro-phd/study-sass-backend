import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { healthcheckRoutes } from '@/routes/healthcheck';

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
    },
  });
  
  await server.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Register routes
  await server.register(healthcheckRoutes, { prefix: '/health' });

  return server;
}