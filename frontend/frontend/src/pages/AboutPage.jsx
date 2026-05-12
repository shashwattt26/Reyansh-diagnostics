import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  Paper 
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BiotechIcon from '@mui/icons-material/Biotech';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationComponent from '../components/landing/LocationComponent';
import SEO from '../components/SEO';



// The service data with expanded, descriptive paragraphs
const detailedDiagnosticSections = [
  {
    title: 'Ultrasound Services',
    icon: <MonitorHeartIcon sx={{ fontSize: 50, color: '#0055ff' }} />,
    description: `Using state-of-the-art Doppler and high-resolution ultrasound technology, our dedicated specialists perform a wide range of critical scans. These precise examinations are essential for diagnosing conditions and monitoring patient health, covering diverse areas such as USG Abdomen, Fetal scans, OBS Basic Scan, Level 2, Anti-scans, Scrotum, Neck, and Small Parts, and many more. Our focus is on precision and patient comfort.`,
  },
  {
    title: 'CT-Scan Center',
    icon: <MedicalInformationIcon sx={{ fontSize: 50, color: '#0055ff' }} />,
    description: `Our powerful CT-Scan unit provides detailed cross-sectional imaging for accurate disease diagnosis and treatment planning. With advanced protocols for patient safety and image clarity, we conduct scans such as NC-CT and CE-CT Head, HR-CT Chest, CT Neck, and Abdomen, and many more. This critical capability allows for rapid and precise medical assessment.`,
  },
  {
    title: 'X-Ray Department',
    icon: <BiotechIcon sx={{ fontSize: 50, color: '#0055ff' }} />,
    description: `We employ fully digital radiography for efficient, high-quality skeletal and internal organ imaging, ensuring quick results with significantly reduced radiation. This service supports diagnostics for diverse conditions impacting the Chest, Abdomen, Knee Joints, Shoulder, PNS, Face, Legs, Wrists, and Hands, and many more. Digital clarity improves diagnostic confidence.`,
  },
  {
    title: 'Pathology Lab',
    icon: <ScienceIcon sx={{ fontSize: 50, color: '#0055ff' }} />,
    description: `Our complete pathology lab, staffed by experienced technicians and pathologists, processes a comprehensive menu of blood, tissue, and bodily fluid tests using automated analyzers. We offer a full range of panels, from routine check-ups to complex screening, such as CBC, Liver Function (LFT), Renal Function (RFT), Thyroid (TFT), ESR, Serum Calcium, Vitamin B12, Iron, and Uric Acid panels, and many more. Fast and accurate results form the foundation of precise treatment.`,
  }
];

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', pb: 10 }}>
      <SEO 
        title="About Us"
        description="Learn about our mission to provide affordable, accurate, and advanced diagnostic testing and medical imaging."
      />
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 } }}>
        {/* Company Logo and Mission header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <img 
            src="/logo.avif" // Replace with the actual URL/path to image_1.png
            alt="Reyansh Diagnostics Logo" 
            style={{ width: '400px', height: 'auto', marginBottom: '24px' }}
          />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', mb: 2 }}>
            Reyansh Imaging & Diagnostics
          </Typography>
          <Typography variant="h6" sx={{ color: '#4b5563', maxWidth: '650px', fontWeight: 400, fontStyle: 'italic', mb: 4 }}>
            Together Through Life...
          </Typography>
          <Divider sx={{ width: '60%', mx: 'auto', mb: 6 }}/>
          <Typography variant="h5" sx={{ color: '#111827', fontWeight: 700, mb: 2 }}>
            Welcome to Our Diagnostic Family
          </Typography>
          <Typography variant="body1" sx={{ color: '#4b5563', maxWidth: '850px', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
            At Reyansh Diagnostics, we are committed to providing precise, timely, and accessible medical diagnostics. Our center combines top-tier medical expertise with the latest advanced technology to ensure accurate results that you and your doctor can trust. From routine check-ups to complex imaging, we strive for diagnostic excellence to support your health journey, always upholding our core value of being 'Together Through Life'.
          </Typography>
        </Box>

        {/* SECTION 1: OUR LEAD DOCTOR */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#ffffff', mb: 8 }}>
          <Grid container spacing={5} alignItems="center">
            {/* Left: Doctor's Image (Placeholder or actual URL) */}
            <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar 
                src="./DrRaviPrakashJaiswal.jpeg" // PLACEHOLDER for Doctor image (Ravi Prakash Jaiswal)
                alt="Dr. Ravi Prakash Jaiswal" 
                sx={{ 
                  width: { xs: 200, md: 240 }, 
                  height: { xs: 200, md: 240 }, 
                  border: '8px solid #f3f4f6', 
                  boxShadow: '0px 10px 20px rgba(0,0,0,0.05)'
                }}
              />
            </Grid>
            {/* Right: Detailed Narrative Bio from Card (image_0.png) */}
            <Grid item xs={12} md={7} lg={8}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                Dr. Ravi Prakash Jaiswal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0055ff', mb: 3 }}>
                Consultant Radiologist
              </Typography>
              <Divider sx={{ mb: 3 }}/>
              <Typography variant="body1" sx={{ color: '#4b5563', mb: 3, lineHeight: 1.8, fontSize: '1.05rem' }}>
                Leading our medical team is Dr. Ravi Prakash Jaiswal, a highly distinguished radiologist. After completing his M.B.B.S. at the esteemed KGMC, Lucknow, and his DNB in Radio Diagnosis in Hyderabad, he brings years of focused training and expertise. He holds a prestigious background as an Ex. Senior Resident at both SGPGIMS, Lucknow, and IMS, BHU. Prior to founding Reyansh Diagnostics, Dr. Jaiswal refined his practice at renowned institutions like Manipal Hospitals and Heritage Institute, Varanasi.
              </Typography>
              <Card variant="outlined" sx={{ bgcolor: '#f9fafb', borderRadius: 3, p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  Expert Specializations:
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                   • Detailed MRI and CT-Scan Interpretation<br/>
                   • Complex MRI & CT-guided Non-Vascular Interventions
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 2: OUR SERVICES & EXPERTISE (Repurposed and expanded data) */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
              Comprehensive Diagnostics & Technology
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', maxWidth: '750px', mx: 'auto', fontWeight: 400 }}>
              Discover our core service areas, where expert interpretation and advanced equipment meet. Each department is designed for accurate screening and diagnostics.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {detailedDiagnosticSections.map((section, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    height: '100%', 
                    borderRadius: 4, 
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#0055ff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                        p: 1, 
                        width: '80px', 
                        height: '80px', 
                        mx: 'auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 3, 
                        bgcolor: 'rgba(0, 85, 255, 0.05)',
                        borderRadius: 3 
                    }}>
                      {section.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                      {section.title}
                    </Typography>
                    <Divider sx={{ mb: 2.5, width: '40%', mx: 'auto' }}/>
                    <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {section.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>



        {/* SECTION 3: MANAGEMENT & CONTACT INFO */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#ffffff' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
              Management & Contact
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', maxWidth: '750px', mx: 'auto', fontWeight: 400 }}>
              Our dedicated management team ensures smooth operations and patient satisfaction. Connect with us for any inquiries.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {/* Anurag Mishra - Marketing Head (from card image_0.png) */}
            <Grid item xs={12} sm={8} md={6}>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#e5e7eb', width: 60, height: 60 }}>
                    <BusinessIcon sx={{ color: '#6b7280', fontSize: 30 }}/>
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                      Anurag Mishra
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0055ff', fontWeight: 500 }}>
                      Marketing Head
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }}/>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PhoneIphoneIcon sx={{ color: '#6b7280' }}/>
                    <Typography variant="body1" sx={{ color: '#4b5563', fontWeight: 600 }}>
                      7800055644
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        <LocationComponent />

      </Container>
    </Box>
  );
}