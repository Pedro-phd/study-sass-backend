import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import * as service from "./user.service";
import { CreateUserSchema } from "./dto";

export const userRoutes = async (server: FastifyInstance) => {
  const typedServer = server.withTypeProvider<ZodTypeProvider>()
  server.addHook('onRoute', (routeOptions) => {
    if(routeOptions.url.startsWith('/user')) {
      const schema = routeOptions.schema
      routeOptions.schema = {
        ...schema,
        security: [
          { bearerAuth: [] }
        ],
        tags: ['user'],
      }
    }
  })

  //get expose jwt
  typedServer.get('/me', {
    onRequest: [server.auth],
  }, async (req, res) => {
    return res.send(req.user);
  });

  //check if user exists in database
  typedServer.get('/:providerId', {
    onRequest: [server.auth],
    schema: {
      params: z.object({
        providerId: z.string().describe('Provider ID, exemple: supabase ID')
      }),
      description: 'Checar se usuário existe no banco de dados'
    }
  }, async (req, res) => {

    const user = await service.GetUserByProviderId(req.params.providerId)
    if (!user) {
      return res.status(404).send({
        message: 'User not found'
      })
    }

    return res.send(user);
  });
  
  //create user
  typedServer.post('/', {
    onRequest: [server.auth],
    schema: {
      body: CreateUserSchema,
      description: 'Criar usuário no banco de dados'
    },
  }, async (req, res) => {
      const user = await service.CreateUser(req.body, req.user);
      return res.send(user);
  });

  //check username is available
  typedServer.get('/check-username/:username', {
    onRequest: [server.auth],
    schema: {
      params: z.object({
        username: z.string().describe('Username for check')
      }),
      description: 'Checar se username está disponível'
    }
  }, async (req, res) => {
    const isAvailable = await service.CheckUsernameIsAvailable(req.params.username)
    return res.send({
      message: isAvailable
    })
  })
}