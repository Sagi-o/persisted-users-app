import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';

type Snapshot = [QueryKey, unknown];

type Options<TData, TVars> = {
  mutationFn: (vars: TVars) => Promise<TData>;
  /**
   * Query-key prefix(es) that bracket every cache this mutation can touch.
   * Used to (1) cancel in-flight reads before applying, (2) snapshot via
   * `getQueriesData` for free rollback, and (3) invalidate on settle.
   */
  scope: QueryKey | QueryKey[];
  /** Mutate the cache in place. Snapshot + rollback are handled for you. */
  apply: (queryClient: QueryClient, vars: TVars) => void;
} & Omit<
  UseMutationOptions<TData, Error, TVars, { snapshots: Snapshot[] }>,
  'mutationFn' | 'onMutate' | 'onError' | 'onSettled' | 'scope'
>;

/**
 * Optimistic mutation with automatic snapshot/restore.
 *
 * The trick: every cache entry under `scope` is captured in one
 * `getQueriesData` call, so rollback is generic — the caller only writes
 * the optimistic `apply` step and lists which key prefix(es) it touches.
 */
export function useOptimisticMutation<TData, TVars>({
  mutationFn,
  scope,
  apply,
  ...rest
}: Options<TData, TVars>) {
  const queryClient = useQueryClient();
  const scopes: QueryKey[] = Array.isArray(scope[0])
    ? (scope as QueryKey[])
    : [scope as QueryKey];

  return useMutation({
    ...rest,
    mutationFn,
    onMutate: async (vars) => {
      await Promise.all(
        scopes.map((key) => queryClient.cancelQueries({ queryKey: key })),
      );
      const snapshots: Snapshot[] = scopes.flatMap((key) =>
        queryClient.getQueriesData({ queryKey: key }),
      );
      apply(queryClient, vars);
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.snapshots) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      for (const key of scopes) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}
