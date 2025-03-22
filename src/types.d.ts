import type { JWT } from "@fastify/jwt"
import type { RouteGenericInterface } from "fastify"
import '@fastify/jwt'
import type { IInternalJWT } from "./domain"

export interface FastifyInstanceWithTypeProvider extends FastifyInstance<RawServerBase,
RawRequestDefaultExpression,
RawRequestDefaultExpression,
FastifyBaseLogger,
ZodTypeProvider
>  {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  auth: any
}

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    auth: any
  }
}


declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
      // Adicione outros campos que você tem no seu payload
    }
    user: IInternalJWT
  }
}