import React from 'react';
import { Box } from '@mui/material';
import MainNavbar from '../components/landing/MainNavBar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import FaqSection from '../components/landing/FaqSection';
import AccreditationsSection from '../components/landing/AccreditationsSection';
import PartnerWithUsSection from '../components/landing/PartnerWithUsSection';
import Footer from '../components/landing/Footer';
import LocationComponent from '../components/landing/LocationComponent';
import SEO from '../components/SEO';

export default function LandingPage() {

  // 🛡️ NEW: Google Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic", // Highly specific schema type
    "name": "Reyansh Diagnostics",
    "image": "https://www.reyanshdiagnostics.com/logo.avif", // Update with actual domain
    "@id": "https://www.reyanshdiagnostics.com",
    "url": "https://www.reyanshdiagnostics.com",
    "telephone": "+917081915644",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Krishna Nagar colony, SA 17/3K-4, Ganpati Nagar, Paharia(near Hotel Surabhi, infront of Indian oil petrol pump)", // Update with full street
      "addressLocality": "Varanasi", 
      "addressRegion": "UP",
      "postalCode": "221007", 
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.3500,
      "longitude": 83.0167
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "14:00"
      }
    ]
    // ,"sameAs": [
    //   // Links to your social media
    //   "https://www.facebook.com/reyanshdiagnostics",
    //   "https://www.instagram.com/reyanshdiagnostics"
    // ]
  };


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>

      <SEO 
        title="Best Pathology Lab & Home Sample Collection"
        description="PNDT certified diagnostic center. We offer accurate blood tests, ambulance services, and home sample collection. Call 7081915644 to book a test today."
        schema={localBusinessSchema}
      />

      {/* Hero Section containing the Booking Card */}
      <HeroSection />
      
      {/* Newly Added Sections based on source inspiration */}
      <FeaturesSection />
      <AccreditationsSection />
      <LocationComponent />
      <StatsSection />

      <FaqSection />
      {/* <PartnerWithUsSection /> // later addition if needed */}
    </Box>
  );
}