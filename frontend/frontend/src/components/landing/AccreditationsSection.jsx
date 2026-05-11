import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Divider } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function AccreditationsSection() {
  return (
    <Box id="accreditations-section" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            fontWeight="800" 
            color="#111827" 
            gutterBottom
            sx={{ letterSpacing: '-0.02em' }}
          >
            Commitment to Ethical Diagnostics
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: '850px', mx: 'auto', fontSize: '1.15rem', lineHeight: 1.8 }}
          >
            At Reyansh Imaging & Diagnostic Center, our operations are built on a foundation of legal compliance and medical integrity. We strictly adhere to the regulatory frameworks of the Government of India to ensure that our advanced imaging technologies are used solely for life-saving medical insights.
          </Typography>
        </Box>

        <Grid container justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
              }}
            >
              <Grid container spacing={6} alignItems="center">
                {/* Visual Icon Side
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      p: 3, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(13, 110, 253, 0.1)',
                      mb: 2
                    }}
                  >
                    <HealthAndSafetyIcon sx={{ fontSize: 80, color: '#0d6efd' }} />
                  </Box>
                  <Typography variant="h5" fontWeight="800" color="#111827">
                    PCPNDT
                  </Typography>
                  <Typography variant="subtitle2" color="#0d6efd" fontWeight="700">
                    Registration No: [Insert ID]
                  </Typography>
                </Grid> */}

                {/* Descriptive Text Side */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" fontWeight="800" mb={2} color="#111827">
                    Pre-Conception & Pre-Natal Diagnostic Techniques (PCPNDT) Act
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={4} sx={{ lineHeight: 1.7 }}>
                    Our center is fully registered and legally certified to perform Ultrasound and Sonography services. This certification is more than just a license; it is our pledge to maintain the highest ethical standards in radiology. We utilize advanced digital imaging to monitor fetal health, detect abnormalities, and provide life-critical data for expectant mothers.
                  </Typography>

                  <Divider sx={{ mb: 4 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={2}>
                        <GavelIcon sx={{ color: '#0d6efd', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="700" color="#111827">
                            Legal Compliance
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Strict adherence to the 1994 Act. We maintain transparent records of every diagnostic scan performed at our facility.
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={2}>
                        <VerifiedIcon sx={{ color: '#10b981', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="700" color="#111827">
                            Ethical Mandate
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            We strictly prohibit sex determination. Our technology is dedicated exclusively to clinical health screening and medical wellness.
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Legal Disclaimer Footer */}
        <Typography 
          variant="caption" 
          textAlign="center" 
          display="block" 
          sx={{ mt: 6, color: '#94a3b8', maxWidth: '600px', mx: 'auto', fontStyle: 'italic' }}
        >
          *Notice: Sex determination before or after conception is a punishable offense under Indian law. We do not perform or support gender detection services.*
        </Typography>
      </Container>
    </Box>
  );
}