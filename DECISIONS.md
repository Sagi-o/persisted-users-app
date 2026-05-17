# Decisions

## Three decisions worth defending

### 1. TanStack Query is the only state manager — no Redux/Zustand/Context

Every piece of "shared" state in this app is server-owned: the random list (cached from randomuser.me), the saved list (from `/api/users`), individual user lookups, the batch-existence map. TanStack Query already handles caching, deduping, invalidation, and request lifecycles for all of it. Adding Redux on top would mean wrapping a cache around a cache, with hand-written reducers duplicating what `useQuery` already does. The remaining state is purely local — filter text, the editable name on Screen 3 — and lives where it belongs: in the component. **Tradeoff:** the moment we add genuinely client-only cross-component state (e.g. a multi-step wizard, a selection set across pages), I'd add Jotai alongside; I would not stretch the query cache to cover it.

### 2. SQLite via Drizzle, not a JSON file

A JSON file is one `fs.writeFileSync` away from a corruption bug under concurrent writes, and forces every read to parse the whole blob. SQLite gets real transactions, indexed lookups, and the `IN (...)` query the `/exists` endpoint relies on for free. Drizzle gives type-safe queries and uses `InferSelectModel` so the `SavedUser` type the client consumes is the same shape the DB returns — no parallel hand-typed DTO to drift. WAL mode is enabled so reads don't block during writes; foreign keys are turned on (SQLite ships with them off). **Tradeoff:** SQLite is a single-writer database on one disk. In production with multiple server instances I'd swap to Postgres — the Drizzle layer makes that a connection-string change plus regenerating the migrations, not a rewrite.

### 3. Debounce only where it pays for itself — two filter hooks, not one

One input filtering on name OR country matches what users actually type ("italy", "akira"). Two inputs would force the user to know which column their term belongs to. Where the filter work actually happens differs by screen, and the hooks reflect that:

- Screen 1 (random list) filters in JS over ~10–100 rows. [`useUserRowFilter.ts`](apps/client/src/app/hooks/useUserRowFilter.ts) holds the input value and computes `filtered` synchronously — no debounce, because the filter is sub-millisecond and a 200ms delay would just be perceived input lag.
- Screen 2 (saved list) hits `/api/users?q=`. [`useSavedUsersSearch.ts`](apps/client/src/app/hooks/useSavedUsersSearch.ts) bundles nuqs' `useQueryState` for the URL-backed value with Mantine's `useDebouncedValue` at 200ms for the value the query actually fires on — short enough to feel instant, long enough to skip a server round trip per keystroke.

**Tradeoff:** two hooks instead of one shared one, so the filter call sites diverge slightly. The alternative — one hook with an "always debounce" knob — either meant 200ms of input lag on the random list for no benefit, or a parameter that's two hooks in a trench coat. With thousands of rows or any per-keystroke server work, debouncing earns its keep; for sub-ms client-side filtering, it doesn't.

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

A batch endpoint and a Mantine `Badge` mark rows in the random list that are already in the DB, so users see which of the 10 randoms they already own before clicking into Screen 3. Per-row `GET /:id` would be wasteful and pollute the cache with negative entries; the batch is one round trip, returns a sparse `{ id: true }` map, and caps at 200 ids server-side via Zod.

### Loading skeletons on every async surface

[`UsersTableSkeleton`](apps/client/src/app/components/UsersTable/UsersTableSkeleton.tsx) and [`ProfileDetailSkeleton`](apps/client/src/app/pages/ProfileDetailSkeleton.tsx) render the real layout — rows, columns, field grid — instead of a generic spinner, so the page reserves its final dimensions and there's no layout jank when data arrives.

### Optimistic create / update / delete

Save / Update / Delete apply locally before the server replies. The mutation hooks snapshot caches on `onMutate`, patch the list, single-user, and every `exists` entry holding the id, roll back on `onError`, and invalidate on `onSettled`. Reused via a `useOptimisticMutation` helper so each mutation only writes the apply step — clicking Save flips the "Saved" badge instantly; clicking Delete removes the row before navigating away.

### URL-backed filter on the saved profiles page

The `/saved` input is wired to `?q=` via [nuqs](https://nuqs.dev/), so the filter is bookmarkable and survives navigating into a profile and back; `clearOnDefault` keeps a blank filter from polluting the URL. URL state and the 200ms debounce live in [`useSavedUsersSearch`](apps/client/src/app/hooks/useSavedUsersSearch.ts), so the page only sees `{ filter, setFilter, debouncedQ, isSearching }`. The random page keeps local state — random ids reshuffle on reload, so a sticky URL filter would mislead.
