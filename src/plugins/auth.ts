import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'

export default fp(async function (fastify: FastifyInstance, opts: any) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRETE || 'supersecret'
  })

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
