import React, { useState } from 'react';
import { 
  Box, Container, Typography, Accordion, 
  AccordionSummary, AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqData = [
  {
    category: "Centre Details & Location",
    items: [
      {
        question: "Where is Reyansh Imaging & Diagnostic Center located?",
        answer: "Our centre is located at SA 17/3K-4, Krishna Nagar Colony, Paharia, Varanasi. You can find us easily right in front of the Indian Oil Petrol Pump, beside Ashirwad Hospital."
      },
      {
        question: "Who is the lead specialist at the centre?",
        answer: "Our medical team is led by Dr. Ravi Prakash Jaiswal (M.B.B.S, DNB), a highly experienced Consultant Radiologist previously associated with SGPGIMS Lucknow and IMS BHU."
      },
      {
        question: "What are the operating hours of Reyansh Diagnostics?",
        answer: "We are open Monday through Saturday from 9:00 AM to 8:00 PM. On Sundays, we provide limited services from 10:00 AM to 2:00 PM."
      }
    ]
  },
  {
    category: "Certifications & Quality",
    items: [
      {
        question: "Is Reyansh Diagnostics PCPNDT certified?",
        answer: "Yes, our centre is fully PCPNDT certified. We strictly adhere to the legal and ethical guidelines laid out by the Government of India regarding ultrasound and diagnostic imaging."
      },
      {
        question: "Are the reports checked by doctors?",
        answer: "Every radiology report (CT-Scan, Ultrasound, X-Ray) is personally reviewed and signed by Dr. Ravi Prakash Jaiswal to ensure 100% diagnostic accuracy."
      }
    ]
  },
  {
    category: "Booking & Reports",
    items: [
      {
        question: "How can I book a test appointment?",
        answer: "You can book directly through our website using the 'Book a Test' card. Simply upload your prescription and provide your details; our team will confirm your slot shortly."
      },
      {
        question: "How do I download my test reports online?",
        answer: "Click on the 'Get Report' tab on our website. Enter the 6-character tracking code sent to your mobile number during registration to view and download your PDF report."
      },
      {
        question: "Do you provide emergency services?",
        answer: "Yes, we provide Ambulance services for rapid patient transportation and prioritize emergency diagnostic cases."
      }
    ]
  },
  {
    category: "Test Preparation",
    items: [
      {
        question: "Is fasting required for my blood test or ultrasound?",
        answer: "For most abdominal ultrasounds and specific blood tests (like Sugar or Lipid Profile), 8-12 hours of fasting is required. Please drink only plain water during this period."
      },
      {
        question: "How should I prepare for a CT Scan?",
        answer: "Depending on the type of scan (NCCT or CECT), you may need to fast for 4 hours. For contrast scans, please bring your previous kidney function (RFT) reports if available."
      },
      {
        question: "What should I know before an Ultrasound?",
        answer: "For pelvic or pregnancy scans, you may be required to have a full bladder. Our staff will guide you on water intake 30 minutes prior to the procedure."
      }
    ]
  }
];

export default function FaqSection() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box id="faqs-section" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          sx={{ textAlign: 'center', mb: 2, color: '#111827' }} 
          fontWeight="800" 
          gutterBottom
        >
          Frequently Asked Questions
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ textAlign: 'center', mb: 8, color: '#4b5563', fontWeight: 400 }}
        >
          Have questions about your visit? Find everything you need to know about Reyansh Diagnostics.
        </Typography>

        {faqData.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 5 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="800" 
              sx={{ 
                mb: 2.5, 
                color: '#0d6efd', 
                textTransform: 'uppercase', 
                letterSpacing: 1.5,
                fontSize: '0.85rem'
              }}
            >
              {section.category}
            </Typography>
            
            {section.items.map((item, itemIndex) => {
              const panelId = `panel-${sectionIndex}-${itemIndex}`;
              return (
                <Accordion 
                  key={panelId}
                  expanded={expanded === panelId} 
                  onChange={handleChange(panelId)}
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: '1px solid #e2e8f0',
                    '&:before': { display: 'none' },
                    borderRadius: '12px !important',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#0d6efd' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: '#0d6efd' }} />}
                    sx={{ py: 1 }}
                  >
                    <Typography fontWeight="700" sx={{ color: '#1f2937' }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: '#ffffff', borderTop: '1px solid #f1f5f9', p: 3 }}>
                    <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.7 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ))}
      </Container>
    </Box>
  );
}