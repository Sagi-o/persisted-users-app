import { useNavigate } from 'react-router-dom';
import { Alert, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useUsers } from '../dal/user/useUserAPI';
import { FilterInput } from '../components/FilterInput';
import { UsersTable } from '../components/UsersTable/UsersTable';
import { UsersTableSkeleton } from '../components/UsersTable/UsersTableSkeleton';
import { savedUserToRow } from '../components/UsersTable/UsersTable.utils';
import { useSavedUsersSearch } from '../hooks/useSavedUsersSearch';

export function SavedListPage() {
  const navigate = useNavigate();
  const { filter, setFilter, debouncedQ, isSearching } = useSavedUsersSearch();
  const { data, isLoading, error } = useUsers(debouncedQ);

  const rows = (data ?? []).map(savedUserToRow);

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
