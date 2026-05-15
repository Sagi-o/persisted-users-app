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
