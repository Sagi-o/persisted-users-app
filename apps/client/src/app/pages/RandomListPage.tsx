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
import { useRandomUsers } from '../dal/randomUser/useRandomUsersAPI';
import { useExistingUserIds } from '../dal/user/useUserAPI';
import { UsersTable } from '../components/UsersTable/UsersTable';
import { randomUserToRow } from '../components/UsersTable/UsersTable.utils';
import { useUserRowFilter } from '../hooks/useUserRowFilter';

export function RandomListPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useRandomUsers();

  const rows = (data ?? []).map(randomUserToRow);
  const { filter, setFilter, filtered } = useUserRowFilter(rows);

  const { data: existingIdsMap } = useExistingUserIds(rows.map((r) => r.id));

  return (
    <Stack>
      <Title order={2}>Random Users</Title>

      <TextInput
        placeholder="Filter by name or country"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
      />

      {error && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Failed to load random users.
        </Alert>
      )}

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : filtered.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          No users match your filter.
        </Text>
      ) : (
        <UsersTable
          users={filtered}
          onRowClick={(id) => navigate(`/profile/random/${id}`)}
          existingIdsMap={existingIdsMap}
        />
      )}
    </Stack>
  );
}