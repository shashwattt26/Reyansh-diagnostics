import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Paper, 
  Divider, 
  Chip,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Stack // Added Stack for layout
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function InlineBookingCard() {
  // Tab State
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Booking State
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [prescription, setPrescription] = useState(null);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState('');
  const [trackingCode, setTrackingCode] = useState(null);

  // Report State
  const [searchCode, setSearchCode] = useState('');
  const [searchPhone, setSearchPhone] = useState(''); // 🛡️ NEW: State for phone number verification
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportResult, setReportResult] = useState(null);

  // --- Handlers ---
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !prescription) {
      return setBookError('Please fill all fields and attach a prescription.');
    }
    setBookLoading(true); 
    setBookError('');

    const data = new FormData();
    data.append('patientName', formData.name);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('prescription', prescription);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/bookings/upload-prescription`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) setTrackingCode(res.data.trackingCode);
    } catch (err) {
      setBookError('Booking failed. Please try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    // 🛡️ SECURITY UPDATE: Ensure both fields are provided
    if (!searchCode || !searchPhone) {
      return setReportError('Both tracking code and phone number are required.');
    }

    setReportLoading(true); 
    setReportError(''); 
    setReportResult(null);

    try {
      // 🛡️ SECURITY UPDATE: Changed to POST and sending both code and phone securely
      const res = await axios.post(`${BACKEND_URL}/api/search`, {
        code: searchCode.trim(),
        phone: searchPhone.trim()
      });
      setReportResult(res.data.data);
    } catch (err) {
      setReportError(err.response?.data?.message || 'No active record found. Please verify details.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        borderRadius: 4, 
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}
    >
      {/* Navigation Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="fullWidth"
        sx={{ 
          bgcolor: '#f8fafc', 
          borderBottom: '1px solid #e2e8f0',
          '& .MuiTab-root': { py: 1.5, fontWeight: 700, fontSize: '0.95rem', color: '#64748b' },
          '& .Mui-selected': { color: '#0d6efd !important' },
          '& .MuiTabs-indicator': { backgroundColor: '#0d6efd', height: 3 }
        }}
      >
        <Tab id="book-test" label="Book a Test" />
        <Tab id="get-report" label="Get Report" />
      </Tabs>

      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* --- TAB 0: BOOK A TEST --- */}
        {tabValue === 0 && (
          <Box>
            {trackingCode ? (
              /* Success State with Visit Instructions */
              <Box textAlign="center" py={0.5}>
                <CheckCircleIcon color="success" sx={{ fontSize: 50, mb: 1, color: '#10b981' }} />
                <Typography variant="h5" fontWeight="800" color="#111827" gutterBottom>
                  Booking Confirmed!
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Your prescription has been uploaded successfully.
                </Typography>

                {/* Instruction Box */}
                <Box sx={{ 
                  bgcolor: '#fffbeb', 
                  border: '1px solid #fde68a', 
                  borderRadius: 3, 
                  p: 2, 
                  mb: 2.5,
                  textAlign: 'center'
                }}>
                  <Typography variant="subtitle2" fontWeight="800" color="#92400e" gutterBottom>
                    Next Steps
                  </Typography>
                  <Typography variant="caption" color="#92400e" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                    Please visit our center for sample collection or required tests during our operating hours:
                  </Typography>
                  
                  <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                    <Typography variant="caption" fontWeight="800" sx={{ color: '#111827' }}>
                      Mon - Sat: 09:00 AM - 08:00 PM
                    </Typography>
                    <Typography variant="caption" fontWeight="800" sx={{ color: '#111827' }}>
                      Sunday: 10:00 AM - 02:00 PM
                    </Typography>
                  </Stack>

                  <Typography variant="caption" fontWeight="700" sx={{ color: '#0d6efd', fontStyle: 'italic' }}>
                    We are waiting for you!
                  </Typography>
                </Box>
                
                <Paper elevation={0} sx={{ bgcolor: '#f8fafc', p: 2, border: '1px dashed #cbd5e1', borderRadius: 3 }}>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1 }}>
                    YOUR TRACKING CODE
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d6efd', mt: 0.5 }}>
                    {trackingCode}
                  </Typography>
                </Paper>
                
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#64748b' }}>
                  Please save this code to download your reports later without any hassle.
                </Typography>
                <Button 
                  size="small"
                  variant="outlined" 
                  sx={{ mt: 3, borderRadius: 2, py: 0.75, px: 3, fontWeight: 600, color: '#0d6efd', borderColor: '#0d6efd' }} 
                  onClick={() => { setTrackingCode(null); setFormData({ name: '', phone: '', address: '' }); setPrescription(null); }}
                >
                  Book Another Test
                </Button>
              </Box>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBookSubmit} noValidate>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, textAlign: 'center' }}>
                  Upload Prescription
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, textAlign: 'center' }}>
                  Provide your details and upload your doctor's prescription.
                </Typography>

                {bookError && <Alert severity="error" sx={{ mb: 2, py: 0, borderRadius: 2 }}>{bookError}</Alert>}
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField size="small" fullWidth required label="Patient Full Name" variant="outlined" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment> }}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField size="small" fullWidth required label="Mobile Number" variant="outlined" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment> }}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField size="small" fullWidth required label="Full Address / Remarks" variant="outlined" multiline rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ mt: -1.5 }}><LocationOnIcon sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment> }}}
                    />
                  </Grid>
                </Grid>
                
                <Button 
                  variant="outlined" 
                  component="label" 
                  fullWidth 
                  startIcon={<CloudUploadIcon />} 
                  sx={{ mt: 2.5, py: 1.25, border: '2px dashed #cbd5e1', color: prescription ? '#0d6efd' : '#64748b', bgcolor: prescription ? '#f0f5ff' : 'transparent', fontWeight: 600, borderRadius: 2 }}
                >
                  {prescription ? prescription.name : 'Click to Upload (Image/PDF)'}
                  <input type="file" hidden accept="image/*, application/pdf" onChange={(e) => setPrescription(e.target.files[0])} />
                </Button>

                <Button type="submit" variant="contained" fullWidth disabled={bookLoading} sx={{ mt: 3, py: 1.25, bgcolor: '#0d6efd', fontWeight: 700, fontSize: '1rem', borderRadius: '50px', boxShadow: 'none', '&:hover': { bgcolor: '#0b5ed7', boxShadow: '0 4px 14px rgba(13, 110, 253, 0.3)' } }}>
                  {bookLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Booking'}
                </Button>
              </form>
            )}
          </Box>
        )}

        {/* --- TAB 1: GET REPORT --- */}
        {tabValue === 1 && (
          <Box sx={{ py: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, textAlign: 'center' }}>
              Track Your Report
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, textAlign: 'center' }}>
              For your security, please enter your 6-character code and registered mobile number.
            </Typography>

            <form onSubmit={handleSearchSubmit}>
              {reportError && <Alert severity="error" sx={{ mb: 2, py: 0, borderRadius: 2 }}>{reportError}</Alert>}
              
              <TextField size="small" fullWidth required label="Enter Tracking Code" variant="outlined" value={searchCode} onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><VpnKeyIcon sx={{ color: '#0d6efd', fontSize: 20 }} /></InputAdornment> }}}
                sx={{ '& .MuiOutlinedInput-root': { letterSpacing: 1 } }}
                inputProps={{ maxLength: 6 }}
              />

              {/* 🛡️ NEW: Phone Number Input for Dual-Factor Authentication */}
              <TextField size="small" fullWidth required label="Registered Mobile Number" variant="outlined" type="tel" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#0d6efd', fontSize: 20 }} /></InputAdornment> }}}
                sx={{ mt: 2, '& .MuiOutlinedInput-root': { letterSpacing: 1 } }}
              />
              
              <Button type="submit" variant="contained" fullWidth disabled={reportLoading || !searchCode || !searchPhone} sx={{ mt: 2.5, py: 1.25, bgcolor: '#111827', fontWeight: 700, fontSize: '1rem', borderRadius: '50px', boxShadow: 'none', '&:hover': { bgcolor: '#000000', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)' } }}>
                {reportLoading ? <CircularProgress size={24} color="inherit" /> : 'Find Report'}
              </Button>
            </form>

            {reportResult && (
              <Paper elevation={0} sx={{ mt: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Patient Details
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#111827', fontWeight: 700, mb: 1.5 }}>
                  {reportResult.patientName}
                </Typography>
                
                <Divider sx={{ mb: 1.5 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#4b5563' }}>Status:</Typography>
                  <Chip 
                    size="small"
                    label={reportResult.status} 
                    color={reportResult.status === 'Report Ready' ? 'success' : 'warning'} 
                    sx={{ fontWeight: 700, borderRadius: 1 }}
                  />
                </Box>

                {reportResult.downloadLink ? (
                  <Button variant="contained" color="success" fullWidth startIcon={<DownloadIcon />} href={`${reportResult.downloadLink}`} target="_blank" sx={{ py: 1, borderRadius: '50px', fontWeight: 700, boxShadow: 'none' }}>
                    Download PDF Report
                  </Button>
                ) : (
                  <Alert severity="info" sx={{ py: 0, '& .MuiAlert-message': { fontSize: '0.85rem' }, borderRadius: 2 }}>
                    Your report is being processed.
                  </Alert>
                )}
              </Paper>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}