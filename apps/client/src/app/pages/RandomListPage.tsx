import { Stack, Title } from '@mantine/core';
import { BackButton } from '../components/BackButton';

export function RandomListPage() {
  return (
    <Stack>
      <BackButton />
      <Title order={2}>Random List</Title>
    </Stack>
  );
}
