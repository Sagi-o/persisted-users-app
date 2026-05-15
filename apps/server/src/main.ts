import Fastify from 'fastify';
import { app } from './app/app';

// Bind to 0.0.0.0 by default so platform reverse proxies (Railway, Render, Fly,
// etc.) can route external traffic into the container. Locally this also works.
const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});
