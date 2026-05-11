import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Stack, Button } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HomeIcon from '@mui/icons-material/Home';
import InlineBookingCard from './BookingCardInline';

// High-quality placeholder medical/diagnostic images
const backgroundImages = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80', // Lab/Microscope
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80', // Clinic setting
  'https://images.unsplash.com/photo-1582719478250-c89400bbbfc5?auto=format&fit=crop&w=2000&q=80',
  'reyansh-imaging-and-diagnostic-centre-pahariya-sarnath-pathology-labs-k7bwgcuwq7.jpg',
  'reyansh-imaging-and-diagnostic-centre-pahariya-sarnath-pathology-labs-ddjcxgehhz.jpg',
  './reyansh-imaging-and-diagnostic-centre-pahariya-sarnath-pathology-labs-7pxwlqp7gu.jpg'  // Diagnostic room
];

export default function HeroSection() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Automatically cycle through images every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        minHeight: { xs: 'auto', md: '90vh' }, 
        display: 'flex', 
        alignItems: 'center',
        color: 'white', 
        overflow: 'hidden',
        // Define global keyframes for this component
        '@keyframes slideUpFade': {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        '@keyframes pulseGlow': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 15px rgba(255, 152, 0, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)' }
        }
      }}
    >
      {/* 1. Crossfading Background Images */}
      {backgroundImages.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentBgIndex === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out', // Smooth crossfade effect
            zIndex: 0,
          }}
        />
      ))}

      {/* 2. Dark Overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          bgcolor: 'rgba(0, 15, 60, 0.75)', // Slightly darker for better text pop
          zIndex: 1 
        }} 
      />

      {/* 3. Foreground Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          
          {/* Left Side: Hero Text */}
          <Grid item xs={12} md={7} size={{ xs: 12, md: 7 }}>
            <Box sx={{ 
              textAlign: { xs: 'center', md: 'left' }
            }}>
              
              {/* Main Heading with Gradient and Animation */}
              <Typography 
                variant="h2" 
                fontWeight="900" 
                gutterBottom 
                sx={{ 
                  letterSpacing: '-1px',
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.8rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #90caf9 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'slideUpFade 0.8s ease-out forwards',
                  textShadow: '0px 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                Together Through Life...
              </Typography>

              {/* Subheading with Delayed Animation */}
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  lineHeight: 1.5, 
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                  color: '#e2e8f0',
                  opacity: 0,
                  animation: 'slideUpFade 0.8s ease-out forwards',
                  animationDelay: '0.2s', // Delays entrance slightly after main heading
                  mb: 4
                }}
              >
                Accurate diagnostics, advanced technology, and compassionate care. 
                <span style={{ color: '#fff', fontWeight: 'bold' }}> Home sample collection available!</span>
              </Typography>

              {/* Eye-Catching Pulsing Phone Number */}
              <Box 
                sx={{ 
                  opacity: 0,
                  animation: 'slideUpFade 0.8s ease-out forwards',
                  animationDelay: '0.4s', // Enters third
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 5
                }}
              >
                <Button
                  component="a"
                  href="tel:+917081915644"
                  variant="contained"
                  startIcon={<PhoneInTalkIcon sx={{ fontSize: '28px !important' }} />}
                  sx={{
                    bgcolor: '#ff9800',
                    color: '#fff',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 800,
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
                    animation: 'pulseGlow 2s infinite', // Infinite pulsing animation
                    '&:hover': {
                      bgcolor: '#e68a00',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Call Now: 7081915644
                </Button>
              </Box>

              {/* Feature Checklist with Delayed Animation */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 3 }} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ 
                  opacity: 0,
                  animation: 'slideUpFade 0.8s ease-out forwards',
                  animationDelay: '0.6s' // Enters last
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedIcon sx={{ color: '#4caf50' }} />
                  <Typography variant="body1" fontWeight="600">PNDT Certified</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospitalIcon sx={{ color: '#f44336' }} />
                  <Typography variant="body1" fontWeight="600">Ambulance Service</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon sx={{ color: '#2196f3' }} />
                  <Typography variant="body1" fontWeight="600">Home Collection</Typography>
                </Box>
              </Stack>

            </Box>
          </Grid>

          {/* Right Side: The Booking Card */}
          <Grid item xs={12} md={5} size={{ xs: 12, md: 5 }}>
            <Box 
              sx={{ 
                opacity: 0,
                animation: 'slideUpFade 0.8s ease-out forwards',
                animationDelay: '0.8s' // Form slides in at the very end
              }}
            >
              <InlineBookingCard />
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}