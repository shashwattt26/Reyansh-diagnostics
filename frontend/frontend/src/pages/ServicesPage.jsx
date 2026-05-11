import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Divider 
} from '@mui/material'; 
import ScienceIcon from '@mui/icons-material/Science';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BiotechIcon from '@mui/icons-material/Biotech';

export default function ServicesPage() {
  // Enhanced service categories with richer descriptions and inline test highlights
  const diagnosticServices = [
    {
      title: 'Ultrasound',
      description: 'Experience high-resolution, non-invasive imaging utilizing advanced sound wave technology. Our state-of-the-art Doppler ultrasound machines provide real-time, crystal-clear insights into internal organs and soft tissues. We specialize in monitoring fetal development with the utmost care during pregnancy, assessing vascular health, and safely guiding diagnostic procedures—all completely free from radiation exposure.',
      testsText: 'We perform a wide variety of scans such as USG - Abdomen, USG - Fetal, OBS Basic Scan, USG - Level 2, Ops Colour Doppler, and many more.',
      icon: <MonitorHeartIcon sx={{ fontSize: 42, color: '#0055ff' }} />
    },
    {
      title: 'CT-Scan',
      description: 'Our advanced cross-sectional computed tomography (CT) imaging provides highly detailed, 3D views of bones, blood vessels, and soft tissues. Equipped with high-slice technology, our scanners ensure rapid image acquisition with minimized radiation doses. This service is essential for the precise, timely diagnosis of complex internal injuries, neurological conditions, and deep tissue abnormalities.',
      testsText: 'We offer specialized scans such as NC-CT Head, CE-CT Head, HR-CT Chest, CT - Abdomen, and many more.',
      icon: <MedicalInformationIcon sx={{ fontSize: 42, color: '#0055ff' }} />
    },
    {
      title: 'X-Ray',
      description: 'Benefit from quick, painless, and highly precise digital radiography. Our fully digital X-ray suites offer superior image clarity and immediate availability for our radiologists. This technology is primarily utilized for examining the skeletal system, detecting micro-fractures, assessing joint health, and identifying chest, lung, or abdominal abnormalities with exceptional accuracy.',
      testsText: 'We conduct routine and specialized imaging such as X-Rays of the Chest, Abdomen, Knee Joints, PNS, Face, and many more.',
      icon: <BiotechIcon sx={{ fontSize: 42, color: '#0055ff' }} />
    },
    {
      title: 'Pathology',
      description: 'Our fully automated, highly sterile laboratory provides comprehensive testing of blood, tissue, and bodily fluids. We guarantee swift turnaround times and pinpoint accuracy to help monitor your overall health and wellness. These vital diagnostics are crucial for detecting diseases at an early stage, evaluating organ function, and guiding effective, personalized treatment plans alongside your physician.',
      testsText: 'Our lab processes vital diagnostics such as CBC (Complete Blood Count), LFT (Liver Function Test), RFT (Renal Function Test), Thyroid (TFT), and many more.',
      icon: <ScienceIcon sx={{ fontSize: 42, color: '#0055ff' }} />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, color: '#111827', mb: 3, letterSpacing: '-0.02em' }}
          >
            Our Diagnostic Services
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: '#4b5563', maxWidth: '800px', mx: 'auto', fontWeight: 400, lineHeight: 1.7 }}
          >
            Experience comprehensive testing and advanced imaging under one roof. We combine state-of-the-art medical technology with expert, compassionate care to guarantee accuracy in your results—ensuring you have the answers you need with the comfort and convenience you deserve.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {diagnosticServices.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    transform: 'translateY(-6px)',
                    borderColor: '#d1d5db'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 4, sm: 5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon & Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(0, 85, 255, 0.08)', 
                      display: 'flex' 
                    }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                      {service.title}
                    </Typography>
                  </Box>
                  
                  {/* Detailed Description */}
                  <Typography 
                    variant="body1" 
                    sx={{ color: '#4b5563', mb: 4, lineHeight: 1.7, flexGrow: 1 }}
                  >
                    {service.description}
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderColor: '#f3f4f6' }} />

                  {/* "Such as..." Tests Text */}
                  <Box sx={{ 
                    bgcolor: '#f8fafc', 
                    p: 2.5, 
                    borderRadius: 2,
                    borderLeft: '4px solid #0055ff'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1e293b', 
                        fontWeight: 500, 
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      <strong style={{ color: '#0055ff' }}>Includes:</strong> {service.testsText}
                    </Typography>
                  </Box>
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}