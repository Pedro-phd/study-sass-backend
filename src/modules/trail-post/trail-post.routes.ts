import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import * as service from "./trail-post.service";
import { CreateTrailPostSchema } from "./dto/create-trail-post.dto";

export const trailPostRoutes = async (server: FastifyInstance) => {
  const typedServer = server.withTypeProvider<ZodTypeProvider>()
  server.addHook('onRoute', (routeOptions) => {
    if(routeOptions.url.split('/').includes('post')) {
      const schema = routeOptions.schema
      routeOptions.schema = {
        ...schema,
        security: [
          { bearerAuth: [] }
        ],
        tags: ['trail-post'],
      }
    }
  })

  server.addHook('preHandler', (routeOptions, reply, done) => {
    if(routeOptions.url.split('/').includes('post')) {
      if(!routeOptions?.user?.id) {
        return reply.status(401).send({
          message: "User not created in internal database"
        })
      }
      done()
    }
  })

  //get trail posts
  typedServer.post('/', {
    onRequest: [server.auth],
    schema: {
      description: 'Pegar posts de uma trilha',
      params: z.object({
        trailId: z.string().describe('ID da trilha'),
      }),
      body: CreateTrailPostSchema
    }
  }, async  (req, res) => {
      await service.CreateTrailPost(req.params.trailId, req.body, req.user)
      return res.code(201).send()
    })

}