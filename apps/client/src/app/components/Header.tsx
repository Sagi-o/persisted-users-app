import { Link, useNavigate } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';

export function Header() {
  const navigate = useNavigate();
  return (
    <Group gap="xs">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Button
        component={Link}
        to="/"
        variant="subtle"
        leftSection={<IconHome size={16} />}
      >
        Home
      </Button>
    </Group>
  );
}
