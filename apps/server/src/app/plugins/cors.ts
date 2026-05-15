import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(cors, {
    origin: [
      'http://localhost:4200',
      'https://persisted-users-app-production.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});
