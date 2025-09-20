import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import logger from '../plugins/logger-plugins';

export default function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error({
      err: error,
      req: {
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query
      }
    }, 'Server error');
  }

  // Don't expose stack traces in production
  const errorResponse = {
    statusCode,
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  };

  reply.status(statusCode).send(errorResponse);
}