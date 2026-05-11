import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Divider, 
  Stack 
} from '@mui/material';

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using the services provided by Reyansh Imaging & Diagnostic Center ('the Center'), you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our website or services."
  },
  {
    title: "2. Services Provided",
    content: "The Center provides diagnostic imaging (CT-Scan, Ultrasound, X-Ray) and pathology services. All tests are performed based on the prescription provided by a registered medical practitioner. The Center reserves the right to refuse a test if the prescription is missing, invalid, or expired."
  },
  {
    title: "3. Appointments and Cancellations",
    content: "Appointments booked online are subject to confirmation based on slot availability. Users must arrive 15 minutes prior to their scheduled time. Cancellations made less than 2 hours before the appointment may be subject to a nominal convenience fee."
  },
  {
    title: "4. Reports and Results",
    content: "Diagnostic reports are generated after thorough review by our qualified radiologists and pathologists. While we strive for 24-hour delivery, some specialized tests may take longer. Digital reports accessed via our 'Tracking Code' system are for convenience and should be correlated clinically by your doctor."
  },
  {
    title: "5. Ethical Mandate & PCPNDT Compliance",
    content: "In accordance with the PCPNDT Act of 1994, Reyansh Imaging & Diagnostic Center strictly prohibits sex determination. Any request for such services will be reported to the appropriate authorities. We maintain absolute transparency in our imaging records as per government regulations."
  },
  {
    title: "6. Medical Disclaimer",
    content: "The information provided on this website is for general awareness and does not substitute professional medical advice. Diagnostic reports are tools for your physician; the Center is not liable for self-diagnosis or self-treatment based on the reports."
  },
  {
    title: "7. Privacy and Data Security",
    content: "We value your privacy. Patient data and reports are stored securely and shared only with the patient or their authorized representative. Please refer to our Privacy Policy for more details on how we handle your medical records."
  },
  {
    title: "8. Governing Law",
    content: "These terms are governed by the laws of India. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh."
  }
];

export default function TermsAndConditions() {
  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="800" color="#111827" gutterBottom>
            Terms & Conditions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Last Updated: May 2026
          </Typography>
        </Box>

        {/* Terms Content Bubble */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 8, 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <Stack spacing={4}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#4b5563' }}>
              Welcome to Reyansh Imaging & Diagnostic Center. These terms govern your use of our diagnostic 
              facilities and digital platforms. Please read them carefully.
            </Typography>

            <Divider />

            {termsSections.map((section, index) => (
              <Box key={index}>
                <Typography 
                  variant="h6" 
                  fontWeight="800" 
                  color="#111827" 
                  gutterBottom
                >
                  {section.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ lineHeight: 1.7 }}
                >
                  {section.content}
                </Typography>
              </Box>
            ))}

            <Divider />

            <Box sx={{ mt: 2, p: 3, bgcolor: '#f0f7ff', borderRadius: 4, border: '1px solid #e0e7ff' }}>
              <Typography variant="body2" color="#0d6efd" fontWeight="600" textAlign="center">
                Questions about our terms? Contact us at <br />
                <strong>reyanshdiagnostics@gmail.com</strong>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}