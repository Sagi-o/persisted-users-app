# Persisted Users

Small full-stack app: a Fastify + SQLite backend and a React frontend that displays random people (from [randomuser.me](https://randomuser.me/)) and lets you persist a subset of them.

**Live:** <https://persisted-users-app-production.up.railway.app/>

Built as an Nx monorepo so the client, server, and a tiny shared lib (Drizzle schema + types) live in one tree.

## Layout

```
apps/
  client/      # React + Vite + Mantine + TanStack Query
  server/      # Fastify + better-sqlite3 + Drizzle
libs/
  shared/      # Drizzle schema + inferred SavedUser type
```

## Prerequisites

- Node ≥ 20 (developed on 24)
- npm ≥ 10

## Install & run (dev)

```sh
npm install
npm run dev
```

Starts both projects in parallel via Nx:

- API: <http://localhost:3000>
- Client: <http://localhost:4200>

In dev the client talks to the API across origins (Fastify allows `localhost:4200` via `@fastify/cors`).

The first server start auto-creates `apps/server/data/app.db` and applies pending migrations from `apps/server/migrations/`.

## Build & run (prod)

```sh
npm run build      # builds client + server
npm start          # runs the built server, which also serves the built client
```

In prod the server statically serves `apps/client/dist` from `/` with an SPA fallback to `index.html` for unknown non-API routes — one port, one process.

## Environment variables

All are optional with sensible defaults.

| Var                 | Default                              | Used by |
|---------------------|--------------------------------------|---------|
| `HOST`              | `localhost`                          | server  |
| `PORT`              | `3000`                               | server  |
| `DATABASE_URL`      | `apps/server/data/app.db`            | server  |
| `MIGRATIONS_PATH`   | `apps/server/migrations`             | server  |
| `CLIENT_DIST_PATH`  | `apps/client/dist`                   | server  |

## API

| Method | Path                    | Body                       | Notes                                                                 |
|-------:|-------------------------|----------------------------|-----------------------------------------------------------------------|
| GET    | `/api/users`            | —                          | List saved users, newest first.                                       |
| GET    | `/api/users/:id`        | —                          | One user or 404.                                                      |
| POST   | `/api/users`            | full user payload          | Persist a user. 409 if already saved.                                 |
| POST   | `/api/users/exists`     | `{ ids: string[] }`        | Batch membership check. Returns sparse `{ id: true }` map.            |
| PATCH  | `/api/users/:id`        | `{ title?, firstName, lastName }` | Update editable name fields.                                  |
| DELETE | `/api/users/:id`        | —                          | Remove a saved user. 204 on success.                                  |

Request bodies are validated with Zod (`apps/server/src/app/modules/user/user.dto.ts`); validation errors return 400 with field-level details.

## Database

Drizzle CLI scripts wrap the workspace's migration files:

```sh
npm run db:generate    # write a new migration from schema changes
npm run db:migrate     # apply migrations (server also does this on startup)
npm run db:studio      # open Drizzle Studio
```

## Submission docs

- [DECISIONS.md](./DECISIONS.md) — the three interesting decisions, the RTL approach, deliberate cut corners, and the extension.
- [AI_USAGE.md](./AI_USAGE.md) — disclosure of AI tooling used.
