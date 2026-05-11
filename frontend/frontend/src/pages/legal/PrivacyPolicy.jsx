import React from 'react';
import { Box, Container, Typography, Paper, Divider, Stack } from '@mui/material';

const policySections = [
  {
    title: "1. Information We Collect",
    content: "We collect personal and medical information including your name, contact details, doctor's prescriptions, and diagnostic test results. This data is collected solely to provide accurate diagnostic services and maintain medical records."
  },
  {
    title: "2. How We Use Your Data",
    content: "Your information is used to process test bookings, generate medical reports, and send tracking codes via SMS. We may also use your contact details to provide important updates regarding your health checkups."
  },
  {
    title: "3. Data Security",
    content: "Patient confidentiality is our top priority. We implement industry-standard encryption and secure server protocols to protect your medical records from unauthorized access. Only authorized medical staff at Reyansh Diagnostics have access to your sensitive reports."
  },
  {
    title: "4. Sharing of Information",
    content: "We do not sell or trade your personal data. Medical information is only shared with you, your referring physician (as per your request), or as required by Indian law (e.g., for PCPNDT compliance)."
  },
  {
    title: "5. Patient Rights & Data Deletion",
    content: "You have the right to access your diagnostic history, request corrections to personal details, and ask for the deletion of your account. However, certain medical records must be retained for specific periods as mandated by health regulations. To initiate a data deletion request, please email your tracking code and registered mobile number to reyanshdiagnostics@gmail.com."
  }
];

export default function PrivacyPolicy() {
  return (
    <Box sx={{ py: 10, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="800" color="#111827" gutterBottom>Privacy Policy</Typography>
          <Typography variant="body1" color="text.secondary">Effective Date: May 2026</Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Stack spacing={4}>
            {policySections.map((section, index) => (
              <Box key={index}>
                <Typography variant="h6" fontWeight="800" color="#111827" gutterBottom>{section.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{section.content}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}