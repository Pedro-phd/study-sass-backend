import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt'

import { userRoutes } from './modules/user/user.route';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import authPlugin from './plugins/auth';
import injectUserPlugin from './plugins/injectUser';
import { trailRoutes } from './modules/trail/trail.route';
import { trailPostRoutes } from './modules/trail-post/trail-post.routes';

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
  await server.register(trailRoutes, { prefix: '/trail', logLevel: 'info' });
  await server.register(trailPostRoutes, { prefix: '/trail/:trailId/post', logLevel: 'info' });


  return server;
}