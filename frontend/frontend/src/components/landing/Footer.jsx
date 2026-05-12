import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Import the router link
import { Box, Container, Grid, Typography, Link, Stack, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function Footer() {
  // Define actual page paths here
  const navigationLinks = [
    { text: 'Home', path: '/' },
    { text: 'About Us', path: '/about' },
    { text: 'Services', path: '/services' }
  ];

  const legalLinks = [
    { text: 'Terms & Conditions', path: '/terms' },
    { text: 'Privacy Policy', path: '/privacy' },
    { text: 'Cookie Policy', path: '/cookies' }
  ];

  return (
    <Box id="footer-section" component="footer" sx={{ bgcolor: '#111', color: 'white', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          
          {/* Column 1: Brand/About Snippet */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="900" color="primary" gutterBottom sx={{ letterSpacing: -0.5 }}>
              REYANSH <span style={{ color: 'white' }}>IMAGING & DIAGNOSTICS</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.500', lineHeight: 1.8, mb: 3, pr: { md: 4 } }}>
              Leading diagnostic excellence in Varanasi. Committed to providing precision-driven imaging and pathology services with a patient-first approach.
            </Typography>
          </Grid>

          {/* Column 2: Navigation Links (Multi-page) */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" gutterBottom>Navigation</Typography>
            <Stack spacing={1.5}>
              {navigationLinks.map((item) => (
                <Link 
                  key={item.text} 
                  component={RouterLink} // Integrates with React Router
                  to={item.path} 
                  underline="none" 
                  variant="body2" 
                  sx={{ 
                    color: 'grey.400', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    transition: '0.2s',
                    '&:hover': { color: 'primary.main', transform: 'translateX(5px)' }
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: '1rem' }} />
                  {item.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 3: Legal Policies (Multi-page) */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" gutterBottom>Legal</Typography>
            <Stack spacing={1.5}>
              {legalLinks.map((item) => (
                <Link 
                  key={item.text} 
                  component={RouterLink} 
                  to={item.path} 
                  underline="none" 
                  variant="body2" 
                  sx={{ 
                    color: 'grey.400', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    transition: '0.2s',
                    '&:hover': { color: 'primary.main', transform: 'translateX(5px)' }
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: '1rem' }} />
                  {item.text}
                </Link>
              ))}
            </Stack>
          </Grid>

{/* Column 4: Get In Touch */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="700" gutterBottom>Get In Touch</Typography>
            <Stack spacing={2.5}>
              
              {/* Phone Link */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <PhoneIcon color="primary" sx={{ fontSize: '1.2rem', mt: 0.3 }} />
                <Link 
                  href="tel:+917800055644" 
                  underline="hover"
                  variant="body2" 
                  sx={{ color: 'grey.400', transition: '0.2s', '&:hover': { color: 'primary.main' } }}
                >
                  +91 7800055644
                </Link>
              </Box>

              {/* Email Link */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <EmailIcon color="primary" sx={{ fontSize: '1.2rem', mt: 0.3 }} />
                <Link 
                  href="mailto:reyanshdiagnostics@gmail.com" 
                  underline="hover"
                  variant="body2" 
                  sx={{ color: 'grey.400', transition: '0.2s', '&:hover': { color: 'primary.main' } }}
                >
                  reyanshdiagnostics@gmail.com
                </Link>
              </Box>

              {/* Location Map Link (Bonus) */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <LocationOnIcon color="primary" sx={{ fontSize: '1.2rem', mt: 0.3 }} />
                <Link 
                  href="https://maps.google.com/?q=Krishna+Nagar+colony,+SA+17/3K-4,+near+hotel+surabhi,+Paharia,+Varanasi,+UP+221007" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  underline="hover"
                  variant="body2" 
                  sx={{ color: 'grey.400', lineHeight: 1.6, transition: '0.2s', '&:hover': { color: 'primary.main' } }}
                >
                  Krishna Nagar colony, SA 17/3K-4, near hotel surabhi, Paharia, Varanasi, UP 221007.
                </Link>
              </Box>

            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ my: 5, borderColor: '#333' }} />

        {/* Copyright Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'grey.600' }}>
            © {new Date().getFullYear()} Reyansh Imaging & Diagnostic Center. All Rights Reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Diagnostic Excellence in Varanasi
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}