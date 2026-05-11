import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HandshakeIcon from '@mui/icons-material/Handshake';

export default function PartnerWithUsSection() {
  return (
    <Box sx={{ py: 8, bgcolor: '#002fff', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Partner With Us
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Join our growing network of over 500+ franchises and business associates. Bring quality healthcare and diagnostics to your city.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="warning" size="large" sx={{ fontWeight: 'bold' }}>
                Franchise Help
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#e0e0e0', bgcolor: 'rgba(255,255,255,0.1)' } }} size="large">
                Become a Business Associate
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }} elevation={0}>
                  <StorefrontIcon sx={{ fontSize: 48, mb: 1, color: '#ff9800' }} />
                  <Typography variant="h5" fontWeight="bold">500+</Typography>
                  <Typography variant="body2">Franchises</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }} elevation={0}>
                  <HandshakeIcon sx={{ fontSize: 48, mb: 1, color: '#ff9800' }} />
                  <Typography variant="h5" fontWeight="bold">36+</Typography>
                  <Typography variant="body2">Cities Covered</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}