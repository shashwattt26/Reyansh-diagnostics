import { Routes, Route } from 'react-router-dom';

// Import Layouts
import MainLayout from './components/layout/MainLayout';

// Import Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StaffManagement from './pages/StaffManagement';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ScrollToTop from './components/ScrollToTop';
import CookiePolicy from './pages/legal/CookiePolicy';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsAndConditions from './pages/legal/TermsAndCond';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <>
      {/* STRICT RULE: ScrollToTop must be OUTSIDE <Routes> 
          but INSIDE your Router (usually defined in main.jsx)
      */}
      <ScrollToTop />

      <Routes>
        {/* ==========================================
            1. PUBLIC ROUTES (Wrapped in MainLayout)
            These pages will have the Navbar and Footer
        ========================================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Route>

        {/* ==========================================
            2. ADMIN ROUTES (Standalone)
            These pages will NOT have the public Navbar/Footer
        ========================================== */}
        <Route path="/staff-login" element={<AdminLogin />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
      </Routes>
    </>
  );
}

export default App;