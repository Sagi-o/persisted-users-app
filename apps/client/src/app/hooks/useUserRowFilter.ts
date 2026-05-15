import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import type { UserRow } from '../components/UsersTable/UsersTable.utils';

// 200ms: long enough that we don't filter on every keystroke, short enough to feel instant.
const DEBOUNCE_MS = 200;

export function useUserRowFilter(rows: UserRow[]) {
  const [filter, setFilter] = useState('');
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
