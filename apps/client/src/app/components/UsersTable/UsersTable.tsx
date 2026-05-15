import { Avatar, Table } from '@mantine/core';
import type { UserRow } from './UsersTable.utils';

interface UsersTableProps {
  users: UserRow[];
  onRowClick: (id: string) => void;
}

export function UsersTable({ users, onRowClick }: UsersTableProps) {
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
