import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export async function healthcheckRoutes(server: FastifyInstance) {
  const healthResponseSchema = z.object({
    status: z.string(),
    timestamp: z.string().datetime(),
    version: z.string(),
  });

  server.get('/', {
    schema: {
      description: 'Health check endpoint to verify API status',
      tags: ['Health'],
      response: {
        200: zodToJsonSchema(healthResponseSchema),
      },
    },
    handler: async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    },
  });
}