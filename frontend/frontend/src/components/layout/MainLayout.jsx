import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import MainNavbar from '../landing/MainNavbar';
import Footer from '../landing/Footer';

export default function MainLayout() {
  return (
    // Box ensures the footer is always pushed to the bottom if content is short
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. Static Navbar at the top */}
      <MainNavbar />

      {/* 2. Dynamic Middle Content with a smooth fade-in transition */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        {/* The <Outlet /> is where your pages will render */}
        <Outlet /> 
      </Box>

      {/* 3. Static Footer at the bottom */}
      <Footer />
      
    </Box>
  );
}