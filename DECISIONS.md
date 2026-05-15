# Decisions

## Three decisions worth defending

### 1. TanStack Query is the only state manager — no Redux/Zustand/Context

Every piece of "shared" state in this app is server-owned: the random list (cached from randomuser.me), the saved list (from `/api/users`), individual user lookups, the batch-existence map. TanStack Query already handles caching, deduping, invalidation, and request lifecycles for all of it. Adding Redux on top would mean wrapping a cache around a cache, with hand-written reducers duplicating what `useQuery` already does. The remaining state is purely local — filter text, the editable name on Screen 3 — and lives where it belongs: in the component. **Tradeoff:** the moment we add genuinely client-only cross-component state (e.g. a multi-step wizard, a selection set across pages), I'd add Jotai alongside; I would not stretch the query cache to cover it.

### 2. SQLite via Drizzle, not a JSON file

A JSON file is one `fs.writeFileSync` away from a corruption bug under concurrent writes, and forces every read to parse the whole blob. SQLite gets real transactions, indexed lookups, and the `IN (...)` query the `/exists` endpoint relies on for free. Drizzle gives type-safe queries and uses `InferSelectModel` so the `SavedUser` type the client consumes is the same shape the DB returns — no parallel hand-typed DTO to drift. WAL mode is enabled so reads don't block during writes; foreign keys are turned on (SQLite ships with them off). **Tradeoff:** SQLite is a single-writer database on one disk. In production with multiple server instances I'd swap to Postgres — the Drizzle layer makes that a connection-string change plus regenerating the migrations, not a rewrite.

### 3. Single debounced filter input at 200ms, behind a hook

One input filtering on name OR country matches what users actually type ("italy", "akira"). Two inputs would force the user to know which column their term belongs to. The 200ms debounce is in [`useUserRowFilter.ts`](apps/client/src/app/hooks/useUserRowFilter.ts) using Mantine's `useDebouncedValue` — long enough to skip per-keystroke filtering, short enough to feel instant. Pulling it behind a hook means Screen 1 and Screen 2 share identical filter semantics with zero duplication. **Tradeoff:** very slow typists may see a noticeable lag before results appear; for 10–100 rows the cost of filtering on every keystroke would also be fine and would feel snappier. With thousands of rows or a server-side filter, debouncing earns its keep.

## RTL/LTR approach on Screen 3

The form is wrapped in `<div dir="rtl">` so labels (`שם`, `כתובת`, `פרטים`, etc.) and the overall flow are RTL. Inside that, every element holding Latin data is forced LTR locally:

- `TextInput` elements (`תואר`, `שם פרטי`, `שם משפחה`) use a `LTR_INPUT` styles override (`direction: 'ltr', textAlign: 'left'`) so the caret and text behave correctly even though the surrounding form is RTL.
- The rendered full name (`Title` element) carries an explicit `dir="ltr"` so a Latin name like "Mr Akira Yamada" doesn't reverse to "Yamada Akira Mr".
- Read-only fields (email, phone, street, country, city) use a small `ReadOnlyField` helper that forces `dir="ltr"` + `text-align: left` on the value while letting the label remain in the parent's RTL flow.
- Buttons sit in a `Group justify="flex-start"` — under RTL flex-start means right-aligned, which is the natural reading-start position for a Hebrew form.

The principle: declare RTL once at the container and override locally on every node that holds Latin content. Not pixel-perfect — I didn't tune punctuation neighbors or numeric runs — but BiDi-aware.

## Corners cut, and what production would look like

- **No tests.** The build is the only verification. In prod I'd add Vitest covering save-from-random → appears-in-saved → delete, against a real Fastify instance + an in-memory SQLite.
- **No pagination.** Saved list returns everything ordered by `createdAt DESC`. Fine here; cursor pagination in prod.
- **No retry/refetch button on the random list.** `staleTime: Infinity` keeps the 10 random users stable within a session; refreshing the page is the only way to get a new batch. A "Shuffle" button would be a one-liner.
- **SQLite migrations applied at boot.** Convenient for a take-home; in prod I'd run migrations as a separate deploy step and fail-fast if the schema is unexpected.
- **Single SQLite file on disk.** See decision #2 — Postgres in prod.

## Extensions

### "Already saved" badge backed by `POST /api/users/exists`

A sparse-map batch endpoint and a Mantine `Badge` in the random list mark rows already in the DB. Picked it over a loading skeleton because it changes the user's decision before they click into Screen 3 — they can see at a glance which of the 10 randoms they already own. The alternative shape (`GET /:id` per row, count 404s) is wasteful, race-prone, and pollutes the cache with negative entries; the batch endpoint is one round trip, returns a `{ id: true }` map (absent key = not saved), and is capped at 200 ids server-side via Zod.

### Optimistic create / update / delete

Save, Update, and Delete now apply locally before the server replies. `useCreateUser` / `useUpdateUser` / `useDeleteUser` in `useUserAPI.ts` snapshot the relevant caches on `onMutate`, mutate the optimistic state (list, single-user, and every `exists` cache entry that contains the id), and roll back on `onError`. `onSettled` invalidates so the server-stamped `createdAt` reconciles back in. The plumbing is reused via a small `useOptimisticMutation` helper, so each mutation only writes the apply step. The visible win pairs with the badge: clicking Save in the random list flips the row's "Saved" badge instantly, and clicking Delete on a saved profile removes it from the list before navigating away.

### URL-backed filter on the saved profiles page

The filter input on `/saved` is wired to a `?q=` search param via [nuqs](https://nuqs.dev/) (`useQueryState` with `parseAsString.withDefault('').withOptions({ clearOnDefault: true })`). Typing "italy" makes the URL `/saved?q=italy`; navigating into a profile and back restores the input; the filter is shareable and bookmarkable; an empty filter strips the param so the address bar stays clean. The shared `useUserRowFilter` hook now accepts an optional `[value, setter]` tuple so the saved page can plug nuqs in while the random page keeps using local state (random ids reshuffle on reload, so a sticky URL filter there would be misleading).
