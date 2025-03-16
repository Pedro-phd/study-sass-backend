import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import * as service from "./trail.service";

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
    schema: {
      params: z.object({
        trailId: z.string().describe('Trail ID')
      }),
      description: 'Pegar trilha com posts'
    }
  }, async (req, res) => {
    const trail = await service.GetTrailById(req.params.trailId)

    if(trail?.ownerId !== req.user.id) {
      return res.status(404).send({
        message: "Trail don't exists"
      })
    }

    return res.send(trail)
  })
}