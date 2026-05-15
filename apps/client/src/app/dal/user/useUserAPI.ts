import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { SavedUser } from '@org/shared';
import {
  userApiService,
  type CreateUserPayload,
  type UpdateNamePayload,
} from './user.api-service';

export const USERS_KEY = 'users';

export const useUsers = () => {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: userApiService.getAll,
  });
};

// Resolves to `null` when the backend has no such user (404). Callers can
// treat `data === null` as "not saved" and `data === SavedUser` as "saved".
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userApiService.getById(id as string),
    enabled: !!id,
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
  });
};

// Patches every `[USERS_KEY, 'exists', *]` cache entry with the given mutator.
// Multiple entries can exist (different id sets across pages); we fan out so
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: CreateUserPayload) => userApiService.create(user),
    onMutate: async (user) => {
      // Cancel in-flight reads so they don't overwrite the optimistic snapshot.
      await queryClient.cancelQueries({ queryKey: [USERS_KEY] });

      const prevList = queryClient.getQueryData<SavedUser[]>([USERS_KEY]);
      const prevUser = queryClient.getQueryData<SavedUser | null>([
        USERS_KEY,
        user.id,
      ]);
      const prevExists = queryClient.getQueriesData<Record<string, true>>({
        queryKey: [USERS_KEY, 'exists'],
      });

      // Server stamps `createdAt`; the placeholder gets replaced on settle.
      const optimistic: SavedUser = { ...user, createdAt: new Date() };

      queryClient.setQueryData<SavedUser[]>([USERS_KEY], (prev) =>
        prev ? [optimistic, ...prev] : [optimistic],
      );
      queryClient.setQueryData<SavedUser | null>(
        [USERS_KEY, user.id],
        optimistic,
      );
      patchExistsCaches(queryClient, (prev) => ({ ...prev, [user.id]: true }));

      return { prevList, prevUser, prevExists };
    },
    onError: (_err, user, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData([USERS_KEY], ctx.prevList);
      queryClient.setQueryData([USERS_KEY, user.id], ctx.prevUser);
      for (const [key, data] of ctx.prevExists) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNamePayload }) =>
      userApiService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: [USERS_KEY] });

      const prevList = queryClient.getQueryData<SavedUser[]>([USERS_KEY]);
      const prevUser = queryClient.getQueryData<SavedUser | null>([
        USERS_KEY,
        id,
      ]);

      const apply = (u: SavedUser): SavedUser => ({ ...u, ...payload });
      queryClient.setQueryData<SavedUser[]>([USERS_KEY], (prev) =>
        prev?.map((u) => (u.id === id ? apply(u) : u)),
      );
      queryClient.setQueryData<SavedUser | null>([USERS_KEY, id], (prev) =>
        prev ? apply(prev) : prev,
      );

      return { prevList, prevUser };
    },
    onError: (_err, { id }, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData([USERS_KEY], ctx.prevList);
      queryClient.setQueryData([USERS_KEY, id], ctx.prevUser);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApiService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [USERS_KEY] });

      const prevList = queryClient.getQueryData<SavedUser[]>([USERS_KEY]);
      const prevUser = queryClient.getQueryData<SavedUser | null>([
        USERS_KEY,
        id,
      ]);
      const prevExists = queryClient.getQueriesData<Record<string, true>>({
        queryKey: [USERS_KEY, 'exists'],
      });

      queryClient.setQueryData<SavedUser[]>([USERS_KEY], (prev) =>
        prev?.filter((u) => u.id !== id),
      );
      // `null` means "not saved" — same shape getById returns on 404.
      queryClient.setQueryData<SavedUser | null>([USERS_KEY, id], null);
      patchExistsCaches(queryClient, (prev) => {
        const { [id]: _gone, ...rest } = prev;
        return rest;
      });

      return { prevList, prevUser, prevExists };
    },
    onError: (_err, id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData([USERS_KEY], ctx.prevList);
      queryClient.setQueryData([USERS_KEY, id], ctx.prevUser);
      for (const [key, data] of ctx.prevExists) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};
