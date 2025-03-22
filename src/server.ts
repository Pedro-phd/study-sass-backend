import fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt, { FastifyJWT } from '@fastify/jwt'

import { userRoutes } from './modules/user/user.route';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from './infra/prisma-client';
import { user } from './domain';
import authPlugin from './plugins/auth';
import injectUserPlugin from './plugins/injectUser';

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
  })

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

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

  server.register(authPlugin)
  server.register(injectUserPlugin)

  // Swagger documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Til API',
        description: 'API documentation with Swagger',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
          }
        }
      },
    },
    transform: jsonSchemaTransform
  });
  
  await server.register(swaggerUi, {
    routePrefix: '/api'
  });

  // Register routes
  await server.register(userRoutes, { prefix: '/users', logLevel: 'info' });


  return server;
}