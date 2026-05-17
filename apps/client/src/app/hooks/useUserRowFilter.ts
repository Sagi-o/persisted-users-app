import { useState } from 'react';
import type { UserRow } from '../components/UsersTable/UsersTable.utils';

export function useUserRowFilter(rows: UserRow[]) {
  const [filter, setFilter] = useState('');

  const q = filter.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q),
      )
    : rows;

  return { filter, setFilter, filtered };
}
