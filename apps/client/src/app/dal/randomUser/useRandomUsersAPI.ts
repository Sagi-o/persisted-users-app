import { useQuery } from '@tanstack/react-query';
import { randomUserApiService } from './randomUser.api-service';

export const RANDOM_USERS_KEY = 'randomUsers';

// staleTime: Infinity — each refetch returns DIFFERENT random people, so we must
// keep the same 10 users stable across navigations within a session. The user
// can force a new batch by reloading the page.
export const useRandomUsers = () => {
  return useQuery({
    queryKey: [RANDOM_USERS_KEY],
    queryFn: () => randomUserApiService.getAll(10),
    staleTime: Infinity,
  });
};
