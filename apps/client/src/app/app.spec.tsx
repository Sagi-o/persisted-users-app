import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import App from './app';
import { theme } from './utils/mantine';

const renderApp = () =>
  render(
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>,
  );

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('should render the title', () => {
    const { getByText } = renderApp();
    expect(getByText('persisted-users-app')).toBeTruthy();
  });
});
