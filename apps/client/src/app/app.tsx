import { Outlet } from 'react-router-dom';
import { Container } from '@mantine/core';

export function App() {
  return (
    <Container size="md" py="xl">
      <Outlet />
    </Container>
  );
}

export default App;
