import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Rating, 
  Stack, 
  LinearProgress, 
  Divider 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoogleIcon from '@mui/icons-material/Google';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const reviews = [
  { name: 'Nupur Singh', text: 'This center, run by Dr. Ravi, is absolutely very cooperative, humble and polite doctor. We\'ve been a few times now, and the reports are always accurate and easy to understand.', rating: 5 },
  { name: 'Sandeep Singh', text: 'Reyansh Diagnostic Center is the best center. Visited multiple times and every report received has been consistently accurate and satisfactory.', rating: 5 },
  { name: 'Rameshwer Kashyap', text: 'I had an outstanding experience at REYANSH DIAGNOSTIC CENTRE. The facility is clean, well-organized, and equipped with the latest technology.', rating: 5 },
  { name: 'Priyanshi Jaiswal', text: 'Since doctor performs the CT scan, the results are accurate and reliable.', rating: 5 },
  { name: 'Raj Kumar', text: 'Must go for authentic report. Highly professional team.', rating: 5 },
  { name: 'Komal Jaiswal', text: 'Good experience Riyansh diagnostic centre. Friendly staff.', rating: 4 },
];

export default function StatsSection() {
  return (
    <Box sx={{ py: 10, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        {/* The Blue Background Bubble Wrapper */}
        <Box 
          sx={{ 
            bgcolor: '#f0f7ff', 
            borderRadius: { xs: 8, md: 16 }, 
            p: { xs: 4, md: 8 }, 
            border: '1px solid #e0e7ff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="800" color="#111827" gutterBottom>
              What Our Patients Say
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <GoogleIcon sx={{ color: '#4285F4', fontSize: 20 }} />
              <Typography variant="body1" fontWeight="600" color="#4b5563">
                Verified Google Reviews
              </Typography>
            </Stack>
          </Box>

          {/* Stats Summary Card */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              bgcolor: '#ffffff', 
              mb: 8,
              maxWidth: '850px',
              mx: 'auto'
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: 'center', borderRight: { md: '1px solid #e2e8f0' } }}>
                <Typography variant="h2" fontWeight="800" color="#111827">4.1</Typography>
                <Rating value={4.1} precision={0.1} readOnly sx={{ color: '#ffb400' }} />
                <Typography variant="body2" color="text.secondary" mt={1}>Varanasi's Trusted Choice</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack spacing={1.5} sx={{ px: { md: 4 } }}>
                  {[5, 4, 3, 2, 1].map((s) => (
                    <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 10 }}>{s}</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={s === 5 ? 55 : s === 4 ? 30 : s === 3 ? 15 : 0} 
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 5, 
                          bgcolor: '#eef2ff', 
                          '& .MuiLinearProgress-bar': { bgcolor: '#ffb400' }
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Review List */}
          <Box sx={{ maxWidth: '850px', mx: 'auto' }}>
            <Stack spacing={5}>
              {reviews.map((r, i) => (
                <Box key={i}>
                  <Stack direction="row" spacing={2} mb={1.5}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#0d6efd', 
                        fontWeight: 700, 
                        boxShadow: '0 4px 10px rgba(13, 110, 253, 0.2)' 
                      }}
                    >
                      {r.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="800" color="#111827">
                        {r.name} 
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981', ml: 0.5, verticalAlign: 'middle' }} />
                      </Typography>
                      <Rating value={r.rating} size="small" readOnly sx={{ color: '#ffb400' }} />
                    </Box>
                  </Stack>
                  <Typography 
                    variant="body1" 
                    color="#4b5563" 
                    sx={{ lineHeight: 1.8, pl: { sm: 7 } }}
                  >
                    "{r.text}"
                  </Typography>
                  {i < reviews.length - 1 && <Divider sx={{ mt: 5, borderColor: '#e2e8f0' }} />}
                </Box>
              ))}
            </Stack>

            {/* --- GOOGLE COMPLIANCE WARNING --- */}
            <Box sx={{ mt: 8, display: 'flex', gap: 1.5, alignItems: 'flex-start', opacity: 0.8 }}>
              <InfoOutlinedIcon sx={{ fontSize: 18, color: '#64748b', mt: 0.2 }} />
              <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                Reviews are automatically processed to detect inappropriate content like fake reviews and spam. We may take down reviews that are flagged in order to comply with Google policies or legal obligations.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}