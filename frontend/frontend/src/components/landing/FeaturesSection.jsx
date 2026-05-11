import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

import BiotechIcon from "@mui/icons-material/Biotech";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EmergencyIcon from "@mui/icons-material/Emergency";
import HomeIcon from "@mui/icons-material/Home";

const features = [
  {
    title: "Advanced Technology",
    desc: "Modern CT Scan, USG & Digital X-Ray facilities.",
    icon: <BiotechIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: "Expert Specialists",
    desc: "Experienced diagnostics team led by Dr. Ravi Jaiswal.",
    icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: "Ambulance Support",
    desc: "Fast ambulance and emergency diagnostic support.",
    icon: <EmergencyIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: "Home Sample Collection",
    desc: "Convenient home sample collection service.",
    icon: <HomeIcon sx={{ fontSize: 40 }} />,
  }
];

export default function FeaturesSection() {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "#f8fbff",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: "#0f172a",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Why Choose Us
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: "1.05rem",
              maxWidth: 750,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Trusted diagnostics with advanced technology,
            expert care, and Home Sample Collection.
          </Typography>
        </Box>

        {/* THE FIX: Using Flexbox instead of Grid. 
          This ensures 3 equal columns on desktop, and 1 column on mobile.
          No awkward wrapping!
        */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack on mobile, side-by-side on desktop
            gap: 4, // Clean, consistent spacing between cards
            justifyContent: "center",
          }}
        >
          {features.map((feat, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                flex: 1, // This forces all 3 cards to be exactly the same width!
                minHeight: 320,
                borderRadius: "28px",
                border: "1px solid #dbe4f0",
                backgroundColor: "#fff",
              }}
            >
              <CardContent
                sx={{
                  p: 5,
                  textAlign: "center",
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 4,
                    borderRadius: "26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0d6efd, #3b82f6)",
                    color: "#fff",
                  }}
                >
                  {feat.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#0f172a",
                    mb: 3,
                    fontSize: "1.4rem",
                  }}
                >
                  {feat.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "1rem",
                    lineHeight: 1.9,
                    px: 1,
                  }}
                >
                  {feat.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}