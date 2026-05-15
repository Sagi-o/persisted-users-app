import { useParams } from 'react-router-dom';
import { Stack, Text, Title } from '@mantine/core';
import { BackButton } from '../components/BackButton';

export function ProfileDetailPage() {
  const { source, id } = useParams<{ source: string; id: string }>();
  return (
    <Stack>
      <BackButton />
      <Title order={2}>Profile Detail</Title>
      <Text>
        source: {source}, id: {id}
      </Text>
    </Stack>
  );
}
