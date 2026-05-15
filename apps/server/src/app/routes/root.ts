import type { FastifyInstance } from 'fastify';
import { userController } from '../modules/user/user.controller.js';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async () => ({ status: 'ok' }));
  fastify.register(userController, { prefix: '/api/users' });
}
