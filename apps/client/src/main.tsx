import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';

import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { router } from './app/utils/router';

// Don't retry 4xx — client errors aren't transient and retrying a bad payload
// is wasted load. Retry up to 2x on network errors and 5xx with exponential
// backoff (400ms → 1.2s) so a flaky link or a brief server hiccup heals
// without surfacing as a failed mutation.
const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= 2) return false;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) return false;
  }
  return true;
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(400 * 3 ** attempt, 3000),
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark" forceColorScheme="dark">
        <ModalsProvider>
          <Notifications />
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
