import { Outlet } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { Header } from './Header';

export function AppShell() {
  return (
    <Stack>
      <Header />
      <Outlet />
    </Stack>
  );
}
