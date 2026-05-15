import {
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { useIsMobile } from '../hooks/useIsMobile';

// Mirrors the ProfileDetailPage layout so the loading state doesn't reflow
// the page when the real profile lands. Mobile stacks every section into a
// single column with a centered hero; desktop uses a horizontal hero and
// multi-column grids for the field groups.
export function ProfileDetailSkeleton() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Stack>
        <div dir="rtl">
          <Stack>
            <Stack align="center" gap={8}>
              <Skeleton circle height={120} />
              <Skeleton height={20} width={180} />
              <Skeleton height={12} width={80} />
            </Stack>

            <Divider />
            <Skeleton height={18} width={60} />
            <Stack gap="sm">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </Stack>

            <Divider />
            <Skeleton height={18} width={70} />
            <Stack gap="sm">
              <FieldSkeleton />
              <FieldSkeleton />
            </Stack>

            <Divider />
            <Skeleton height={18} width={70} />
            <Stack gap="sm">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </Stack>

            <Divider />
            <Skeleton height={18} width={90} />
            <Stack gap="sm">
              <FieldSkeleton />
              <FieldSkeleton />
            </Stack>

            <Divider />

            <Group justify="flex-start">
              <Skeleton height={36} width={100} radius="sm" />
              <Skeleton height={36} width={100} radius="sm" />
            </Group>
          </Stack>
        </div>
      </Stack>
    );
  }

  return (
    <Stack>
      <div dir="rtl">
        <Stack>
          <Group align="center" wrap="nowrap">
            <Skeleton circle height={160} width={160} />
            <Stack gap={8} style={{ minWidth: 0, flex: 1 }}>
              <Skeleton height={26} width="40%" />
              <Skeleton height={12} width="20%" />
            </Stack>
          </Group>

          <Divider />
          <Skeleton height={18} width={60} />
          <SimpleGrid cols={3}>
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </SimpleGrid>

          <Divider />
          <Skeleton height={18} width={70} />
          <SimpleGrid cols={2}>
            <FieldSkeleton />
            <FieldSkeleton />
          </SimpleGrid>

          <Divider />
          <Skeleton height={18} width={70} />
          <SimpleGrid cols={2}>
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </SimpleGrid>

          <Divider />
          <Skeleton height={18} width={90} />
          <SimpleGrid cols={2}>
            <FieldSkeleton />
            <FieldSkeleton />
          </SimpleGrid>

          <Divider />

          <Group justify="flex-start">
            <Skeleton height={36} width={100} radius="sm" />
            <Skeleton height={36} width={100} radius="sm" />
          </Group>
        </Stack>
      </div>
    </Stack>
  );
}

function FieldSkeleton() {
  return (
    <Stack gap={6}>
      <Skeleton height={10} width="30%" />
      <Skeleton height={14} width="70%" />
    </Stack>
  );
}
