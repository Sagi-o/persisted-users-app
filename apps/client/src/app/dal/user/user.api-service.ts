import { api } from '../api';
import type { SavedUser } from '@org/shared';

// `createdAt` is server-generated, so the client never sends it.
export type CreateUserPayload = Omit<SavedUser, 'createdAt'>;

export type UpdateNamePayload = {
  title?: string;
  firstName: string;
  lastName: string;
};

export const userApiService = {
  getAll: async (): Promise<SavedUser[]> => {
    const { data } = await api.get<SavedUser[]>('/users');
    return data;
  },

  create: async (user: CreateUserPayload): Promise<SavedUser> => {
    const { data } = await api.post<SavedUser>('/users', user);
    return data;
  },

  update: async (id: string, payload: UpdateNamePayload): Promise<SavedUser> => {
    const { data } = await api.patch<SavedUser>(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
