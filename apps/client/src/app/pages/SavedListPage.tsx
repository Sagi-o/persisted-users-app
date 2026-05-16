import { useNavigate } from 'react-router-dom';
import { Alert, Stack, Text, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useUsers } from '../dal/user/useUserAPI';
import { FilterInput } from '../components/FilterInput';
import { UsersTable } from '../components/UsersTable/UsersTable';
import { UsersTableSkeleton } from '../components/UsersTable/UsersTableSkeleton';
import { savedUserToRow } from '../components/UsersTable/UsersTable.utils';

// Long enough that we don't hit the server on every keystroke,
// short enough to feel instant.
const SEARCH_DEBOUNCE_MS = 200;

export function SavedListPage() {
  const navigate = useNavigate();
  // Filter lives in `?q=` so it survives navigating into a profile and back,
  // and can be linked/bookmarked. `clearOnDefault` strips the empty value
  // from the URL so a blank filter leaves a clean address bar.
  const [filter, setFilter] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  );
  const [debouncedQ] = useDebouncedValue(filter.trim(), SEARCH_DEBOUNCE_MS);
  const { data, isLoading, error } = useUsers(debouncedQ);

  const rows = (data ?? []).map(savedUserToRow);
  const isSearching = debouncedQ.length > 0;

  return (
    <Stack>
      <Title order={2}>Saved Profiles</Title>

      <FilterInput
        value={filter}
        onChange={setFilter}
        placeholder="Filter by name or country"
      />

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Failed to load saved users.
        </Alert>
      )}

      {isLoading ? (
        <UsersTableSkeleton rows={10} />
      ) : rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          {isSearching
            ? 'No users match your filter.'
            : 'No saved profiles yet. Open Fetch and save someone first.'}
        </Text>
      ) : (
        <UsersTable
          users={rows}
          onRowClick={(id) => navigate(`/profile/saved/${id}`)}
        />
      )}
    </Stack>
  );
}
