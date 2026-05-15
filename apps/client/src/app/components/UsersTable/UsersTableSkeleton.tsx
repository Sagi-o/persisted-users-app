import { Card, Group, Skeleton, Stack, Table } from '@mantine/core';
import { useIsMobile } from '../../hooks/useIsMobile';

interface UsersTableSkeletonProps {
  rows?: number;
}

// Mirrors the UsersTable layout so the loading state doesn't reflow the page
// when the real rows land — same row count, same column widths, same card
// shape on mobile.
export function UsersTableSkeleton({ rows = 8 }: UsersTableSkeletonProps) {
  const isMobile = useIsMobile();
  const placeholders = Array.from({ length: rows });

  if (isMobile) {
    return (
      <Stack gap="sm">
        {placeholders.map((_, i) => (
          <Card key={i} withBorder padding="sm" radius="md">
            <Group wrap="nowrap" align="flex-start">
              <Skeleton circle height={38} />
              <Stack gap={6} style={{ flex: 1 }}>
                <Skeleton height={12} width="60%" />
                <Skeleton height={10} width="40%" />
                <Skeleton height={10} width="75%" />
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Table verticalSpacing="sm" withTableBorder>
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
        {placeholders.map((_, i) => (
          <Table.Tr key={i}>
            <Table.Td>
              <Skeleton circle height={38} />
            </Table.Td>
            <Table.Td>
              <Skeleton height={12} width="70%" />
            </Table.Td>
            <Table.Td>
              <Skeleton height={12} width="50%" />
            </Table.Td>
            <Table.Td>
              <Skeleton height={12} width="60%" />
            </Table.Td>
            <Table.Td>
              <Skeleton height={12} width="70%" />
            </Table.Td>
            <Table.Td>
              <Skeleton height={12} width="80%" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
