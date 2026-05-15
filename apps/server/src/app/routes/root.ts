import { existsSync } from 'node:fs';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { userController } from '../modules/user/user.controller.js';

const clientDist =
  process.env.CLIENT_DIST_PATH ?? path.resolve(process.cwd(), 'apps/client/dist');

export default async function (fastify: FastifyInstance) {
  fastify.register(userController, { prefix: '/api/users' });

  // Server SPA client app
  if (existsSync(path.join(clientDist, 'index.html'))) {
    fastify.register(fastifyStatic, { root: clientDist });

    fastify.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api')) {
        reply.code(404).send({ message: 'Not Found' });
        return;
      }
      reply.sendFile('index.html');
    });
  } else {
    fastify.get('/', async () => ({ status: 'ok' }));
  }
}
