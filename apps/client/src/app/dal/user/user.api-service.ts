import axios from 'axios';
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
  getAll: async (q?: string): Promise<SavedUser[]> => {
    const { data } = await api.get<SavedUser[]>('/users', {
      params: q ? { q } : undefined,
    });
    return data;
  },

  // 404 → null lets callers use a single query to answer
  // "is this user persisted?" without splitting an error path.
  getById: async (id: string): Promise<SavedUser | null> => {
    try {
      const { data } = await api.get<SavedUser>(`/users/${id}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
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

  // Server returns only the existing ids (mapped to `true`). Absent key → not saved.
  existingIdsMap: async (ids: string[]): Promise<Record<string, true>> => {
    const { data } = await api.post<Record<string, true>>('/users/exists', {
      ids,
    });
    return data;
  },
};
