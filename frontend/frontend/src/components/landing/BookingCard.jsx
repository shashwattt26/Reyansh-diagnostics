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
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Grid,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BookingCard() {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setTrackingCode(null); // Optional: Reset success state on close
  };

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
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {/* 1. The Trigger Button (Pill Shape) */}
      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{ 
          bgcolor: '#0d6efd', 
          color: '#ffffff',
          px: 5,
          py: 1.25,
          borderRadius: '50px', 
          fontSize: '1.15rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#0b5ed7',
            boxShadow: '0 4px 14px rgba(13, 110, 253, 0.3)',
          }
        }}
      >
        Book Appointment
      </Button>

      {/* 2. The Pop-up Dialog */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <IconButton 
          onClick={handleClose} 
          sx={{ position: 'absolute', right: 12, top: 12, color: '#9ca3af', zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            bgcolor: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': { py: 2.5, fontWeight: 700, fontSize: '1rem', color: '#64748b' },
            '& .Mui-selected': { color: '#0d6efd !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#0d6efd', height: 3 }
          }}
        >
          <Tab label="Book a Test" />
          <Tab label="Get Report" />
        </Tabs>

        <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
          {/* --- TAB 0: BOOK A TEST --- */}
          {tabValue === 0 && (
            <Box>
              {trackingCode ? (
                /* Success State with Visit Instructions */
                <Box textAlign="center" py={1}>
                  <CheckCircleIcon sx={{ fontSize: 60, mb: 2, color: '#10b981' }} />
                  <Typography variant="h4" fontWeight="800" color="#111827" gutterBottom>
                    Booking Confirmed!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Your prescription has been uploaded successfully.
                  </Typography>

                  <Box sx={{ 
                    bgcolor: '#fffbeb', 
                    border: '1px solid #fde68a', 
                    borderRadius: 3, 
                    p: 2.5, 
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    <Typography variant="subtitle2" fontWeight="800" color="#92400e" gutterBottom>
                      Next Steps
                    </Typography>
                    <Typography variant="body2" color="#92400e" sx={{ mb: 1.5, lineHeight: 1.6 }}>
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

                    <Typography variant="body2" fontWeight="700" sx={{ color: '#0d6efd', fontStyle: 'italic' }}>
                      We are waiting for you!
                    </Typography>
                  </Box>
                  
                  <Paper elevation={0} sx={{ bgcolor: '#f8fafc', p: 3, border: '1px dashed #cbd5e1', borderRadius: 3 }}>
                    <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1 }}>
                      YOUR TRACKING CODE
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#0d6efd', mt: 1 }}>
                      {trackingCode}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="body2" sx={{ mt: 3, color: '#64748b' }}>
                    Take a screenshot or save this code to download your report later.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 4, borderRadius: 2, py: 1, px: 4, fontWeight: 600 }} 
                    onClick={() => { setTrackingCode(null); setFormData({ name: '', phone: '', address: '' }); setPrescription(null); }}
                  >
                    Book Another Test
                  </Button>
                </Box>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBookSubmit} noValidate>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1, textAlign: 'center' }}>
                    Upload Prescription
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
                    Provide patient details and a valid doctor's prescription.
                  </Typography>

                  {bookError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{bookError}</Alert>}
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs:12 }}>
                      <TextField fullWidth required label="Patient Full Name" variant="outlined" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#9ca3af' }} /></InputAdornment> }}}
                      />
                    </Grid>
                    <Grid size={{ xs:12 }}>
                      <TextField fullWidth required label="Mobile Number" variant="outlined" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#9ca3af' }} /></InputAdornment> }}}
                      />
                    </Grid>
                    <Grid size={{ xs:12 }}>
                      <TextField fullWidth required label="Address / Remarks" variant="outlined" multiline rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ mt: -3 }}><LocationOnIcon sx={{ color: '#9ca3af' }} /></InputAdornment> }}}
                      />
                    </Grid>
                  </Grid>
                  
                  <Button 
                    variant="outlined" 
                    component="label" 
                    fullWidth 
                    startIcon={<CloudUploadIcon />} 
                    sx={{ mt: 3, py: 2, border: '2px dashed #cbd5e1', color: prescription ? '#0d6efd' : '#64748b', bgcolor: prescription ? '#f0f5ff' : 'transparent', fontWeight: 600, borderRadius: 2 }}
                  >
                    {prescription ? prescription.name : 'Attach Prescription (Image/PDF)'}
                    <input type="file" hidden accept="image/*, application/pdf" onChange={(e) => setPrescription(e.target.files[0])} />
                  </Button>

                  <Button type="submit" variant="contained" fullWidth size="large" disabled={bookLoading} sx={{ mt: 4, py: 1.5, bgcolor: '#0d6efd', fontWeight: 700, fontSize: '1.05rem', borderRadius: 2 }}>
                    {bookLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Booking'}
                  </Button>
                </form>
              )}
            </Box>
          )}

          {/* --- TAB 1: GET REPORT --- */}
          {tabValue === 1 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1, textAlign: 'center' }}>
                Track Your Report
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
                For your security, please enter your 6-character tracking code and registered phone number.
              </Typography>

              <form onSubmit={handleSearchSubmit}>
                {reportError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{reportError}</Alert>}
                
                <TextField fullWidth required label="Enter Tracking Code" variant="outlined" value={searchCode} onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  InputProps={{ startAdornment: <InputAdornment position="start"><VpnKeyIcon sx={{ color: '#0d6efd' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem', letterSpacing: 1 } }}
                  inputProps={{ maxLength: 6 }}
                />

                {/* 🛡️ NEW: Phone Number Input for Dual-Factor Authentication */}
                <TextField fullWidth required label="Registered Phone Number" variant="outlined" type="tel" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#0d6efd' }} /></InputAdornment> }}
                  sx={{ mt: 2, '& .MuiOutlinedInput-root': { fontSize: '1.1rem', letterSpacing: 1 } }}
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth size="large" 
                  disabled={reportLoading || !searchCode || !searchPhone} 
                  sx={{ mt: 3, py: 1.5, bgcolor: '#111827', fontWeight: 700, fontSize: '1.05rem', borderRadius: 2 }}
                >
                  {reportLoading ? <CircularProgress size={24} color="inherit" /> : 'Find Report'}
                </Button>
              </form>

              {reportResult && (
                <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700 }}>Patient Details</Typography>
                  <Typography variant="h6" sx={{ color: '#111827', fontWeight: 700, mb: 2 }}>{reportResult.patientName}</Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4b5563' }}>Status:</Typography>
                    <Chip 
                      label={reportResult.status} 
                      color={reportResult.status === 'Report Ready' ? 'success' : 'warning'} 
                      sx={{ fontWeight: 700, borderRadius: 1 }}
                    />
                  </Box>

                  {reportResult.downloadLink ? (
                    <Button variant="contained" color="success" fullWidth startIcon={<DownloadIcon />} href={`${reportResult.downloadLink}`} target="_blank" sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                      Download PDF Report
                    </Button>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      Processing in lab. Please check back later.
                    </Alert>
                  )}
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}