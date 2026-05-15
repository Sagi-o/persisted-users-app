import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import type { UserRow } from '../components/UsersTable/UsersTable.utils';

// 200ms: long enough that we don't filter on every keystroke, short enough to feel instant.
const DEBOUNCE_MS = 200;

// Setter is widened to `unknown` so callers can pass nuqs' `useQueryState`
// setter (returns a Promise) or a plain `useState` setter without ceremony.
type FilterState = readonly [string, (next: string) => unknown];

export function useUserRowFilter(rows: UserRow[], external?: FilterState) {
  const localState = useState('');
  const [filter, setFilter] = external ?? localState;
  const [debouncedFilter] = useDebouncedValue(filter, DEBOUNCE_MS);

  const q = debouncedFilter.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q),
      )
    : rows;

  return { filter, setFilter, filtered };
}
