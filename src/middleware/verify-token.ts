import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { DecodedToken } from "../middleware/decode_token.model";

dotenv.config();
declare module '@fastify/jwt' {
  interface FastifyRequest {
    user?: any;
  }
}
dotenv.config();

export const decodeToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers?.authorization;

  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ message: 'Unauthorized - Token not found or invalid format' });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET || 'your-secret-key-here';

  try {
    const decoded = jwt.verify(token, secretKey) as any;
    if (decoded) {
      const user: DecodedToken = {
        user_id: decoded.user_id,
        userType: decoded.user_type,
        role_id: decoded.role_id,
        client_id: decoded.client_ids,
        username: decoded.preferred_username,
        realm_access: decoded.realm_access,
        resource_access: decoded.resource_access,
        // impersonator: decoded.impersonator
        //     ? {
        //         id: decoded.impersonator.id,
        //     }
        //     : undefined,
      };
      request.user = user;
      return user;
    }

    return reply.status(401).send({
      is_token_expired: true,
      message: 'Invalid or expired refresh token',
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        is_token_expired: true,
        message: 'Invalid or expired refresh token',
      });
    }

    return reply.status(401).send({
      message: 'Unauthorized - Invalid token',
    });
  }
};
