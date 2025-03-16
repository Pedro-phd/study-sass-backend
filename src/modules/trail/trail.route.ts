import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import * as service from "./trail.service";
import { createTrailSchema, updateTrailSchema } from "./dto";

export const trailRoutes = async (server: FastifyInstance) => {
  const typedServer = server.withTypeProvider<ZodTypeProvider>()
  server.addHook('onRoute', (routeOptions) => {
    if(routeOptions.url.startsWith('/trail')) {
      const schema = routeOptions.schema
      routeOptions.schema = {
        ...schema,
        security: [
          { bearerAuth: [] }
        ],
        tags: ['trail'],
      }
    }
  })

  server.addHook('preHandler', (routeOptions, reply, done) => {
    if(routeOptions.url.startsWith('/trail')) {
      if(!routeOptions?.user?.id) {
        return reply.status(401).send({
          message: "User not created in internal database"
        })
      }
      done()
    }
  })

  //get my trails
  typedServer.get('/', {
    onRequest: [server.auth],
    schema: {
      description: 'Pegar  minhas trilhas'
    }
  }, async (req, res) => {
    const trails = await service.GetMyTrails(req.user.id)
    return res.send(trails)
  })

  //get trail by id with posts
  typedServer.get('/:trailId', {
    onRequest: [server.auth],
    schema: {
      params: z.object({
        trailId: z.string().describe('Trail ID')
      }),
      description: 'Pegar trilha com posts'
    }
  }, async (req, res) => {
    const trail = await service.GetTrailById(req.params.trailId, req.user?.id)
    return res.send(trail)
  })

  //create trail
  typedServer.post('/', {
    onRequest: [server.auth],
    schema: {
      body: createTrailSchema
    },
  }, async (req, res) => {
    const trail = await service.CreateTrail(req.body, req.user.id)
    return res.send(trail)
  })

  //update trail
  typedServer.put('/:trailId', {
    onRequest: [server.auth],
    schema: {
      body: updateTrailSchema,
      params: z.object({ trailId: z.string().describe('Trail ID') })
    },
  }, async (req, res) => {
    const trail = await service.UpdateTrail(req.params.trailId, req.body, req.user.id)
  })

  //soft delete trail
  typedServer.delete('/:trailId', {
    onRequest: [server.auth],
    schema: {
      body: updateTrailSchema,
      params: z.object({ trailId: z.string().describe('Trail ID') })
    },
  }, async (req, res) => {
    const trail = await service.DeleteTrail(req.params.trailId, req.user.id)
  })
}