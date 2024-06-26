import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2787F5',
    },
    secondary: {
      main: '#d9e4f0',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#17a2b8',
    },
    grey: {
      '100': '#f5f8fb',
      '200': '#f6f9fb',
      '300': '#ebf1f7',
      '400': '#e2ecf3',
      '500': '#adb5bd',
      '600': '#95aac9',
      '700': '#495057',
      '800': '#343a40',
      '900': '#293951',
    },
  },
  shape: {
    borderRadius: 9.6,
  },
  typography: {
    body1: {
      fontSize: '0.9375rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});
