import { Avatar, Card, Group, Stack, Table, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { UserRow } from './UsersTable.utils';

interface UsersTableProps {
  users: UserRow[];
  onRowClick: (id: string) => void;
}

export function UsersTable({ users, onRowClick }: UsersTableProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');

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
                <Text fw={500} truncate>
                  {u.fullName}
                </Text>
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
            <Table.Td>{u.fullName}</Table.Td>
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
