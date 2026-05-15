import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routes } from './utils/router';

const renderAt = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>,
  );
};

describe('App', () => {
  it('renders the home screen at /', () => {
    const { getByText } = renderAt('/');
    expect(getByText('Persisted Users')).toBeTruthy();
    expect(getByText('Fetch')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });
});
