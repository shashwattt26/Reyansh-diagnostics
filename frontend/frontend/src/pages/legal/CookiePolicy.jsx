import React from 'react';
import { Box, Container, Typography, Paper, Stack } from '@mui/material';

export default function CookiePolicy() {
  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="800" color="#111827" gutterBottom>Cookie Policy</Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Stack spacing={3}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Reyansh Imaging & Diagnostic Center uses "cookies" to enhance your browsing experience. 
              Cookies are small text files stored on your device that help our website remember your 
              preferences and session data.
            </Typography>
            
            <Typography variant="h6" fontWeight="800" color="#111827">Strictly Necessary Cookies</Typography>
            <Typography variant="body2" color="text.secondary">
              These are essential for the website to function, such as allowing you to access your 
              reports securely via the tracking code system.
            </Typography>

            <Typography variant="h6" fontWeight="800" color="#111827">Analytical Cookies</Typography>
            <Typography variant="body2" color="text.secondary">
              We use tools like Google Analytics to understand how visitors interact with our site, 
              which helps us improve our digital services. This data is anonymized.
            </Typography>

            <Typography variant="h6" fontWeight="800" color="#111827">Managing Cookies</Typography>
            <Typography variant="body2" color="text.secondary">
              You can choose to disable cookies through your browser settings; however, doing so 
              may prevent you from using certain features like the online report download.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}