import type { FastifyInstance } from 'fastify';
import { validate } from '../../utils/validate.js';
import { userService } from './user.service.js';
import {
  ExistingIdsDTO,
  ListUsersQueryDTO,
  SaveUserDTO,
  UpdateNameDTO,
} from './user.dto.js';

export const userController = async (app: FastifyInstance) => {
  app.get<{ Querystring: { q?: string } }>('/', async (req) => {
    const { q } = validate(ListUsersQueryDTO, req.query);
    return userService.list(q);
  });

  app.get<{ Params: { id: string } }>('/:id', async (req) => {
    const user = userService.getById(req.params.id);
    if (!user) throw app.httpErrors.notFound('User not found');
    return user;
  });

  app.post('/', async (req, reply) => {
    const body = validate(SaveUserDTO, req.body);
    if (userService.getById(body.id)) {
      throw app.httpErrors.conflict('User already saved');
    }
    const created = userService.create(body);
    reply.code(201).send(created);
  });

  // Batch membership lookup. Returns `{ id: boolean }` for every input id so
  // the client can do O(1) lookups without building a Set client-side.
  // POST to keep ids in the body (URL length / encoding) and signal "with body".
  app.post('/exists', async (req) => {
    const { ids } = validate(ExistingIdsDTO, req.body);
    return userService.existingIdsMap(ids);
  });

  app.patch<{ Params: { id: string } }>('/:id', async (req) => {
    const body = validate(UpdateNameDTO, req.body);
    const updated = userService.update(req.params.id, body);
    if (!updated) throw app.httpErrors.notFound('User not found');
    return updated;
  });

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const removed = userService.delete(req.params.id);
    if (!removed) throw app.httpErrors.notFound('User not found');
    reply.code(204).send();
  });
};
