import { Stack, Title } from '@mantine/core';
import { BackButton } from '../components/BackButton';

export function SavedListPage() {
  return (
    <Stack>
      <BackButton />
      <Title order={2}>Saved Profiles</Title>
    </Stack>
  );
}
