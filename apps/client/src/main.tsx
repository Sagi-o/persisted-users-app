import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';

import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import App from './app/app';
import { theme } from './app/utils/mantine';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
);
