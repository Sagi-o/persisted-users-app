import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Center,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconSearch } from '@tabler/icons-react';
import { useUsers } from '../dal/user/useUserAPI';
import { UsersTable } from '../components/UsersTable/UsersTable';
import { savedUserToRow } from '../components/UsersTable/UsersTable.utils';
import { BackButton } from '../components/BackButton';
import { useUserRowFilter } from '../hooks/useUserRowFilter';

export function SavedListPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useUsers();

  const rows = (data ?? []).map(savedUserToRow);
  const { filter, setFilter, filtered } = useUserRowFilter(rows);

  return (
    <Stack>
      <BackButton />
      <Title order={2}>Saved Profiles</Title>

      <TextInput
        placeholder="Filter by name or country"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
      />

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Failed to load saved users.
        </Alert>
      )}

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
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
