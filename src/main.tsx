import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';
import './styles.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f8f4d',
      dark: '#126238',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb',
    },
    background: {
      default: '#f4f7fb',
    },
    info: {
      main: '#0f766e',
    },
    warning: {
      main: '#f4b400',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    subtitle1: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
