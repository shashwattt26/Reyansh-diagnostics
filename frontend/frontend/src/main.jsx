import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import axios from 'axios';
import { HelmetProvider } from 'react-helmet-async';

axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: {
    // This sets the global font
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    
    // Setting specific styles for a more "designed" look
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none', // Prevents that aggressive all-caps default
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7, // Improves readability for longer text
    }
  },
  palette: {
    primary: {
      main: '#0d6efd',
    },
    secondary: {
      main: '#111827',
    },
  },
});

export default theme;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This BrowserRouter is exactly what fixes your error! */}
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);