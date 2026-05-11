import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Stack, 
  Link,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function ContactSection() {
  const address = "Krishna Nagar colony, SA 17/3K-4, near hotel surabhi, Ganpathi Nagar, Paharia, Varanasi, UP 221007";
  
  // 100% FREE method: Using the standard Google Maps search embed URL. No API Key required!
  const freeMapUrl = "https://maps.google.com/maps?q=Reyansh+Imaging+&+Diagnostic+Center,+Paharia,+Varanasi&t=&z=15&ie=UTF8&iwloc=&output=embed";

  // Link for the "Get Directions" button to open the Google Maps app/website
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Reyansh+Imaging+&+Diagnostic+Center,+Paharia,+Varanasi";

  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <Grid container>
            {/* Contact Information Side */}
            <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 6 }, bgcolor: '#ffffff' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 4, color: '#111827' }}>
                Visit Our Center
              </Typography>

              <Stack spacing={4}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOnIcon sx={{ color: '#0055ff', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Our Address</Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.6 }}>
                      {address}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <PhoneInTalkIcon sx={{ color: '#0055ff', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Contact Numbers</Typography>
                    <Link href="tel:+918303717016" underline="none" sx={{ color: '#4b5563', display: 'block' }}>
                      +91 83037 17016
                    </Link>
                    <Link href="tel:+917800055644" underline="none" sx={{ color: '#4b5563', display: 'block' }}>
                      +91 78000 55644
                    </Link>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <AccessTimeFilledIcon sx={{ color: '#0055ff', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Working Hours</Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                      Mon - Sat: 09:00 AM - 08:00 PM<br />
                      Sunday: 10:00 AM - 02:00 PM
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                startIcon={<DirectionsIcon />}
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 6, bgcolor: '#0055ff', py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
              >
                Get Directions on Google Maps
              </Button>
            </Grid>

            {/* Free Google Map iframe Side */}
            <Grid item xs={12} md={7} sx={{ minHeight: { xs: '400px', md: 'auto' } }}>
              <Box sx={{ width: '100%', height: '100%', minHeight: '500px' }}>
                <iframe
                  title="Reyansh Diagnostics Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={freeMapUrl}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}