import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

export function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="subtle"
      leftSection={<IconArrowLeft size={16} />}
      onClick={() => navigate(-1)}
      w="fit-content"
    >
      Back
    </Button>
  );
}
