import React, { useState } from 'react';
import { 
  Box, Container, Typography, IconButton, Drawer, 
  List, ListItem, ListItemText, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingCard from './BookingCard';

export default function MainNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', targetId: 'footer-section' } 
  ];

  const handleNavigation = (item) => {
    setMobileOpen(false); // Close drawer on mobile click
    if (item.path) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.targetId) {
      const element = document.getElementById(item.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', width: '100%', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #eaeaea' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: { xs: 1, md: 1.5 } }}>
          
          {/* LOGO */}
          <Box onClick={() => handleNavigation({ path: '/' })} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src="/logo.avif" alt="Reyansh Logo" style={{ height: '50px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </Box>

          {/* DESKTOP LINKS (Hidden on mobile) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 5 }}>
            {navItems.map((item) => {
              const isActive = item.path && location.pathname === item.path;
              return (
                <Typography
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  sx={{
                    fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                    color: isActive ? '#0055ff' : '#4b5563', 
                    transition: 'color 0.2s', '&:hover': { color: '#0055ff' } 
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Box>

          {/* RIGHT SIDE: Booking Button & Mobile Menu Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* The Booking Card Button shrinks slightly on mobile inherently if styled well, but we keep it visible */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <BookingCard />
            </Box>

            {/* Hamburger Icon (Hidden on Desktop) */}
            <IconButton 
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#111827' }} 
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>

        </Box>
      </Container>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="800" color="primary">Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map((item) => {
              const isActive = item.path && location.pathname === item.path;
              return (
                <ListItem button key={item.label} onClick={() => handleNavigation(item)} sx={{ borderRadius: 2, mb: 1, bgcolor: isActive ? '#f0f7ff' : 'transparent' }}>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: isActive ? 800 : 600, color: isActive ? '#0055ff' : '#111827' }} 
                  />
                </ListItem>
              );
            })}
            {/* Show Booking button inside drawer for very small screens */}
            <Box sx={{ mt: 4, display: { xs: 'block', sm: 'none' } }}>
              <BookingCard />
            </Box>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}