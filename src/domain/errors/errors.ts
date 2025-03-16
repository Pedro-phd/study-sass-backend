import createError from "@fastify/error";


export const NotFoundError = createError('NOT_FOUND', '%s', 404)
