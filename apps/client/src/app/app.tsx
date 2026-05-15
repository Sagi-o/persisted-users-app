import { Suspense } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Button, Center, Container, Group, Loader, Stack, Title } from '@mantine/core';

export function App() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      }
    >
      <Container size="md" py="xl">
        <Stack>
          <Title order={1}>Persisted Users</Title>
          <Group>
            <Button component={Link} to="/">Home</Button>
            <Button component={Link} to="/page-2" variant="light">Page 2</Button>
          </Group>
          <Routes>
            <Route path="/" element={<Title order={3}>Home</Title>} />
            <Route path="/page-2" element={<Title order={3}>Page 2</Title>} />
          </Routes>
        </Stack>
      </Container>
    </Suspense>
  );
}

export default App;
