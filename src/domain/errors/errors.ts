import createError from "@fastify/error";


export const NotFoundError = createError('NOT_FOUND', '%s', 404)
export const ConflictError = createError('CONFLICT', '%s', 409)
