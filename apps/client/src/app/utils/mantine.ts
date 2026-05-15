import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Roboto Slab, Heebo, sans-serif',
  },
  components: {
    Text: {
      defaultProps: {
        size: 'sm',
      },
    },
    Button: {
      defaultProps: {
        size: 'xs',
      },
    },
  },
});
