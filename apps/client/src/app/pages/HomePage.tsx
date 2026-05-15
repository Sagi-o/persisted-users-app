import { Link } from 'react-router-dom';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconHistory, IconUsers } from '@tabler/icons-react';

export function HomePage() {
  return (
    <Stack align="center" gap="xl" mt="xl">
      <Stack gap={4} align="center">
        <Title order={1}>Persisted Users</Title>
        <Text c="dimmed">Browse random people, save the ones you like.</Text>
      </Stack>
      <Group>
        <Button
          component={Link}
          to="/random"
          size="md"
          leftSection={<IconUsers size={18} />}
        >
          Fetch
        </Button>
        <Button
          component={Link}
          to="/saved"
          size="md"
          variant="light"
          leftSection={<IconHistory size={18} />}
        >
          History
        </Button>
      </Group>
    </Stack>
  );
}
