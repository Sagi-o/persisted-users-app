import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: CreateUserPayload) => userApiService.create(user),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNamePayload }) =>
      userApiService.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApiService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
};
