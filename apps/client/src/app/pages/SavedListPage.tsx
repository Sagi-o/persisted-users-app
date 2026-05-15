import { useNavigate } from 'react-router-dom';
import { Alert, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useUsers } from '../dal/user/useUserAPI';
import { FilterInput } from '../components/FilterInput';
import { UsersTable } from '../components/UsersTable/UsersTable';
import { UsersTableSkeleton } from '../components/UsersTable/UsersTableSkeleton';
import { savedUserToRow } from '../components/UsersTable/UsersTable.utils';
import { useUserRowFilter } from '../hooks/useUserRowFilter';

export function SavedListPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useUsers();

  const rows = (data ?? []).map(savedUserToRow);
  // Filter lives in `?q=` so it survives navigating into a profile and back,
  // and can be linked/bookmarked. `clearOnDefault` strips the empty value
  // from the URL so a blank filter leaves a clean address bar.
  const filterState = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  );
  const { filter, setFilter, filtered } = useUserRowFilter(rows, filterState);

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
        <UsersTableSkeleton rows={8} />
      ) : rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          No saved profiles yet. Open Fetch and save someone first.
        </Text>
      ) : filtered.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          No users match your filter.
        </Text>
      ) : (
        <UsersTable
          users={filtered}
          onRowClick={(id) => navigate(`/profile/saved/${id}`)}
        />
      )}
    </Stack>
  );
}
