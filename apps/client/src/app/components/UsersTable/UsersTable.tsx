import { Avatar, Badge, Card, Group, Stack, Table, Text } from '@mantine/core';
import { useIsMobile } from '../../hooks/useIsMobile';
import { IconBookmarkFilled } from '@tabler/icons-react';
import type { UserRow } from './UsersTable.utils';

interface UsersTableProps {
  users: UserRow[];
  onRowClick: (id: string) => void;
  /** Sparse map of id → true for ids that exist in the DB. Missing key = not saved. */
  existingIdsMap?: Record<string, true>;
}

function SavedBadge() {
  return (
    <Badge
      size="xs"
      color="teal"
      variant="light"
      leftSection={<IconBookmarkFilled size={10} />}
    >
      Saved
    </Badge>
  );
}

export function UsersTable({ users, onRowClick, existingIdsMap }: UsersTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Stack gap="sm">
        {users.map((u) => (
          <Card
            key={u.id}
            withBorder
            padding="sm"
            radius="md"
            onClick={() => onRowClick(u.id)}
            style={{ cursor: 'pointer' }}
          >
            <Group wrap="nowrap" align="flex-start">
              <Avatar src={u.thumbnail} radius="xl" />
              <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                <Group gap={6} wrap="nowrap">
                  <Text fw={500} truncate>
                    {u.fullName}
                  </Text>
                  {existingIdsMap?.[u.id] && <SavedBadge />}
                </Group>
                <Text size="sm" c="dimmed" tt="capitalize">
                  {u.gender} · {u.country}
                </Text>
                <Text size="sm" truncate>
                  {u.email}
                </Text>
                <Text size="sm" c="dimmed">
                  {u.phone}
                </Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Table highlightOnHover withTableBorder verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={48}></Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Gender</Table.Th>
          <Table.Th>Country</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Email</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((u) => (
          <Table.Tr
            key={u.id}
            onClick={() => onRowClick(u.id)}
            style={{ cursor: 'pointer' }}
          >
            <Table.Td>
              <Avatar src={u.thumbnail} radius="xl" />
            </Table.Td>
            <Table.Td>
              <Group gap={6} wrap="nowrap">
                {u.fullName}
                {existingIdsMap?.[u.id] && <SavedBadge />}
              </Group>
            </Table.Td>
            <Table.Td tt="capitalize">{u.gender}</Table.Td>
            <Table.Td>{u.country}</Table.Td>
            <Table.Td>{u.phone}</Table.Td>
            <Table.Td>{u.email}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
