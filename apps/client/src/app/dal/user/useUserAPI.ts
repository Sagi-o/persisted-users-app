import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { SavedUser } from '@org/shared';
import { useOptimisticMutation } from '../useOptimisticMutation';
import {
  userApiService,
  type CreateUserPayload,
  type UpdateNamePayload,
} from './user.api-service';

export const USERS_KEY = 'users';
const LIST_KEY = 'list';

// staleTime: Infinity across the user queries — mutations are the only thing
// that can change this data, and they already invalidate on settle. Without
// it, a query mounted right after an optimistic mutation (e.g. navigating to
// /saved after a Save) auto-refetches and races the in-flight POST/DELETE,
// briefly replacing the optimistic row with a stale server response.
//
// `q` is part of the key so each search term caches independently;
// `keepPreviousData` keeps the previous results visible while the next
// search is in flight, avoiding a skeleton flash on every keystroke.
export const useUsers = (q = '') => {
  return useQuery({
    queryKey: [USERS_KEY, LIST_KEY, q],
    queryFn: () => userApiService.getAll(q || undefined),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
};

// Resolves to `null` when the backend has no such user (404). Callers can
// treat `data === null` as "not saved" and `data === SavedUser` as "saved".
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userApiService.getById(id as string),
    enabled: !!id,
    staleTime: Infinity,
  });
};

// Batch membership check — pass any list of ids, get back a
// `{ id: boolean }` map for O(1) client lookups. Cache key includes a
// sorted id list so the same set in any order hits the same cache entry.
export const useExistingUserIds = (ids: string[]) => {
  const sortedIds = [...ids].sort();
  return useQuery({
    queryKey: [USERS_KEY, 'exists', sortedIds],
    queryFn: () => userApiService.existingIdsMap(ids),
    enabled: ids.length > 0,
    staleTime: Infinity,
  });
};

// Patches every `[USERS_KEY, 'exists', *]` cache entry with the given mutator.
// Multiple entries can exist (different id sets across pages); fan out so
// the optimistic flip is visible regardless of which page is mounted.
function patchExistsCaches(
  queryClient: QueryClient,
  mutate: (prev: Record<string, true>) => Record<string, true>,
) {
  const entries = queryClient.getQueriesData<Record<string, true>>({
    queryKey: [USERS_KEY, 'exists'],
  });
  for (const [key, prev] of entries) {
    if (prev) queryClient.setQueryData(key, mutate(prev));
  }
}

// Lists are cached per search term — fan the optimistic update out across
// every `[USERS_KEY, 'list', *]` entry. The settled `invalidateQueries` on
// `[USERS_KEY]` corrects any list whose membership the predicate changed
// (e.g. an optimistically-prepended row that doesn't match the active q).
function patchListCaches(
  queryClient: QueryClient,
  mutate: (prev: SavedUser[]) => SavedUser[],
) {
  const entries = queryClient.getQueriesData<SavedUser[]>({
    queryKey: [USERS_KEY, LIST_KEY],
  });
  for (const [key, prev] of entries) {
    if (prev) queryClient.setQueryData(key, mutate(prev));
  }
}

export const useCreateUser = () =>
  useOptimisticMutation({
    mutationFn: (user: CreateUserPayload) => userApiService.create(user),
    scope: [USERS_KEY],
    apply: (queryClient, user) => {
      // Server stamps `createdAt`; the placeholder gets replaced on settle.
      const optimistic: SavedUser = { ...user, createdAt: new Date() };
      patchListCaches(queryClient, (prev) => [optimistic, ...prev]);
      queryClient.setQueryData<SavedUser | null>(
        [USERS_KEY, user.id],
        optimistic,
      );
      patchExistsCaches(queryClient, (prev) => ({ ...prev, [user.id]: true }));
    },
  });

export const useUpdateUser = () =>
  useOptimisticMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNamePayload }) =>
      userApiService.update(id, payload),
    scope: [USERS_KEY],
    apply: (queryClient, { id, payload }) => {
      const merge = (u: SavedUser): SavedUser => ({ ...u, ...payload });
      patchListCaches(queryClient, (prev) =>
        prev.map((u) => (u.id === id ? merge(u) : u)),
      );
      queryClient.setQueryData<SavedUser | null>([USERS_KEY, id], (prev) =>
        prev ? merge(prev) : prev,
      );
    },
  });

export const useDeleteUser = () =>
  useOptimisticMutation({
    mutationFn: (id: string) => userApiService.delete(id),
    scope: [USERS_KEY],
    apply: (queryClient, id) => {
      patchListCaches(queryClient, (prev) => prev.filter((u) => u.id !== id));
      // `null` means "not saved" — same shape getById returns on 404.
      queryClient.setQueryData<SavedUser | null>([USERS_KEY, id], null);
      patchExistsCaches(queryClient, (prev) => {
        const { [id]: _gone, ...rest } = prev;
        return rest;
      });
    },
  });
