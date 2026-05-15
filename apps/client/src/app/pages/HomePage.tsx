import { Link } from 'react-router-dom';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconHistory, IconUsers } from '@tabler/icons-react';
import { MeshGradient } from '../components/MeshGradient';

export function HomePage() {
  return (
    <Box
      pos="relative"
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        minHeight: 460,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Box pos="absolute" inset={0} style={{ zIndex: 0 }}>
        <MeshGradient />
      </Box>

      {/* Vignette: darkens the edges so the gradient reads as backdrop, not poster.
          Keeps title + buttons high-contrast without flattening the mesh. */}
      <Box
        pos="absolute"
        inset={0}
        style={{
          zIndex: 1,
          background:
            'radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Stack
        align="center"
        justify="center"
        gap="xl"
        py={96}
        px="md"
        style={{ position: 'relative', zIndex: 2, minHeight: 460 }}
      >
        <Stack gap={6} align="center">
          <Title
            order={1}
            ta="center"
            style={{
              color: '#fff',
              letterSpacing: '-0.02em',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textShadow: '0 2px 24px rgba(0,0,0,0.4)',
            }}
          >
            Persisted Users
          </Title>
          <Text c="rgba(255,255,255,0.78)" ta="center" size="lg">
            Browse random people, save the ones you like.
          </Text>
        </Stack>

        <Group>
          <Button
            component={Link}
            to="/random"
            size="md"
            radius="md"
            leftSection={<IconUsers size={18} />}
          >
            Fetch
          </Button>
          <Button
            variant="outline"
            color="white"
            component={Link}
            to="/saved"
            size="md"
            radius="md"
            leftSection={<IconHistory size={18} />}
          >
            History
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
