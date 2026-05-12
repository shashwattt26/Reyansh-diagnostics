import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, Snackbar, Alert, IconButton, Tooltip
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Upload Report State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Add Booking State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: '', phone: '', address: '' });
  const [addPrescription, setAddPrescription] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // NEW: Anonymize State
  const [anonymizeDialog, setAnonymizeDialog] = useState(false);
  const [bookingToAnonymize, setBookingToAnonymize] = useState(null);
  const [anonymizing, setAnonymizing] = useState(false);

  useEffect(() => {
    // 🛡️ SECURITY UPDATE: We no longer look for 'adminToken' in localStorage
    const role = localStorage.getItem('userRole'); 
    setUserRole(role);

    // Check for role instead of token for basic UI routing
    if (!role) {
      navigate('/staff-login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/bookings`, {
          // 🛡️ SECURITY UPDATE: Tell Axios to send the secure httpOnly cookie natively!
          withCredentials: true 
        });
        // Only load bookings that haven't been soft-deleted
        const activeBookings = (response.data.data || response.data).filter(b => !b.is_deleted);
        setBookings(activeBookings); 
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate('/staff-login');
        }
      }
    };
    fetchBookings();

    const socket = io(BACKEND_URL);
    socket.on('newBooking', (newBookingData) => {
      setBookings((prevBookings) => [newBookingData, ...prevBookings]);
      setToast({ open: true, message: `New Booking Alert: ${newBookingData.patient_name}`, severity: 'info' });
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    // Note: To make logout 100% secure later, you should also call a backend /logout endpoint 
    // that clears the httpOnly cookie from the browser.
    navigate('/staff-login');
  };

  // --- Report Upload Handlers ---
  const handleUploadReport = async () => {
    if (!reportFile || !selectedBooking) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('reportPdf', reportFile); 

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/reports/upload/${selectedBooking.id}`, 
        formData, 
        { 
          // 🛡️ SECURITY UPDATE: Include credentials, remove manual Authorization header
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' } 
        }
      );

      if (response.data.success) {
        setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'Report Ready' } : b));
        setOpenDialog(false);
        setToast({ open: true, message: `Report successfully uploaded for ${selectedBooking.patient_name}`, severity: 'success' });
      }
    } catch (error) {
      alert('Upload failed. Ensure the server folder "uploads/reports" exists.');
    } finally {
      setUploading(false);
    }
  };

  const openUploadModal = (booking) => {
    setSelectedBooking(booking);
    setReportFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setReportFile(null);
  };

  // --- Add Booking Handlers ---
  const handleAddBooking = async () => {
    if (!addFormData.name || !addFormData.phone || !addFormData.address) return alert('Fill all details.');
    
    setAddLoading(true);
    const formData = new FormData();
    formData.append('patientName', addFormData.name);
    formData.append('phone', addFormData.phone);
    formData.append('address', addFormData.address);
    if (addPrescription) formData.append('prescription', addPrescription);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/bookings/upload-prescription`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ open: true, message: `Manual booking created! Tracking Code: ${response.data.trackingCode}`, severity: 'success' });
        setOpenAddDialog(false);
        setAddFormData({ name: '', phone: '', address: '' });
        setAddPrescription(null);
      }
    } catch (error) {
      alert('Failed to create booking.');
    } finally {
      setAddLoading(false);
    }
  };

  // --- NEW: Anonymize Booking Handlers ---
  const triggerAnonymizeModal = (booking) => {
    setBookingToAnonymize(booking);
    setAnonymizeDialog(true);
  };

  const confirmAnonymization = async () => {
    if (!bookingToAnonymize) return;
    setAnonymizing(true);

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/bookings/${bookingToAnonymize.id}/anonymize`, 
        {}, 
        { 
          // 🛡️ SECURITY UPDATE: Use credentials for the backend to verify your admin role natively
          withCredentials: true 
        }
      );

      if (response.data.success) {
        // Remove the booking from the local table instantly
        setBookings(prev => prev.filter(b => b.id !== bookingToAnonymize.id));
        setToast({ open: true, message: 'Patient data successfully anonymized.', severity: 'warning' });
        setAnonymizeDialog(false);
      }
    } catch (error) {
      alert('Failed to anonymize data. Check backend routes.');
    } finally {
      setAnonymizing(false);
      setBookingToAnonymize(null);
    }
  };

  // --- Filter & Search Logic ---
    const filteredBookings = bookings.filter((booking) => {
    const currentStatus = booking.status || 'Pending Review';
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (booking.patient_name?.toLowerCase().includes(query)) ||
      (booking.phone?.includes(query)) ||
      (booking.short_code?.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 8 }}>
      
      {/* Responsive Top Navigation */}
      <Box sx={{ 
        bgcolor: '#0052cc', color: 'white', 
        p: { xs: 2, md: 3 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', alignItems: 'center', gap: { xs: 2, md: 0 }, mb: 4, boxShadow: 2 
      }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', textAlign: 'center' }}>
          <Box component="img" src="/logo.avif" alt="Logo" sx={{ height: { xs: 50, md: 80 }, width: 'auto', mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }} />
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Reyansh Diagnostics</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}>
          {userRole === 'admin' && (
            <Button color="inherit" size="small" startIcon={<PeopleIcon />} onClick={() => navigate('/admin/staff')} sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Staff</Button>
          )}
          <Button color="inherit" size="small" onClick={handleLogout} startIcon={<LogoutIcon />}>Logout</Button>
        </Box>
      </Box>

      <Container maxWidth="xl">
        {/* Responsive Header Controls */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', md: 'flex-start' }, gap: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">Live Bookings</Typography>
            <Chip icon={<NotificationsActiveIcon fontSize="small" />} label="Live Sync" color="success" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: 2 }}>
            <TextField
              size="small" placeholder="Search name, phone, or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 220 }, bgcolor: 'white', borderRadius: 1 }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'action.active' }} /></InputAdornment>) }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 }, bgcolor: 'white', borderRadius: 1 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select value={statusFilter} label="Filter Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="All">All Bookings</MenuItem>
                <MenuItem value="Pending Review">Pending Review</MenuItem>
                <MenuItem value="Report Ready">Report Ready</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)} sx={{ fontWeight: 'bold', px: 3, py: { xs: 1.5, md: 1 }, whiteSpace: 'nowrap' }}>
              Add Booking
            </Button>
          </Box>
        </Box>

        {/* Responsive Table */}
        <TableContainer component={Card} elevation={4} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 850 }}> 
            <TableHead sx={{ bgcolor: '#f0f4f8' }}>
              <TableRow>
                <TableCell><b>Tracking Code</b></TableCell>
                <TableCell><b>Patient Name</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Prescription</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No active bookings found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0052cc' }}>{booking.short_code || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{booking.patient_name}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>
                      <Chip label={booking.status || 'Pending Review'} color={booking.status === 'Report Ready' ? 'success' : 'warning'} size="small" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell>
                      {booking.prescription_url ? (
                        <Button variant="text" size="small" href={`${booking.prescription_url}`} target="_blank">View File</Button>
                      ) : <Typography variant="caption">No File</Typography>}
                    </TableCell>
                    <TableCell>
                      {/* Flexbox for Action buttons to keep them aligned cleanly */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        
                        {/* 🛡️ RECEPTIONIST BLOCK: Only show "Process Report" if they are NOT a receptionist */}
                        {userRole !== 'receptionist' && (
                          <Button 
                            variant="contained" size="small" onClick={() => openUploadModal(booking)}
                            disabled={booking.status === 'Report Ready'}
                            sx={{ bgcolor: booking.status === 'Report Ready' ? 'grey.400' : 'primary.main', whiteSpace: 'nowrap' }}
                          >
                            {booking.status === 'Report Ready' ? 'Report Sent' : 'Process Report'}
                          </Button>
                        )}
                        
                        {/* 🛡️ ADMIN BLOCK: Only Admins should be allowed to delete/anonymize data */}
                        {userRole === 'admin' && (
                          <Tooltip title="Anonymize Patient Data">
                            <IconButton color="error" size="small" onClick={() => triggerAnonymizeModal(booking)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* --- LIVE NOTIFICATION TOAST --- */}
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%', fontWeight: 'bold', boxShadow: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* --- ANONYMIZE CONFIRMATION DIALOG --- */}
      <Dialog open={anonymizeDialog} onClose={() => setAnonymizeDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Confirm Data Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.6 }}>
            Are you sure you want to anonymize the record for <b>{bookingToAnonymize?.patient_name}</b>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#d32f2f', mt: 2, fontWeight: 600 }}>
            This will permanently erase their personal details (Name, Phone, Address) to comply with data privacy laws, but the record will remain archived for statutory compliance. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAnonymizeDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmAnonymization} disabled={anonymizing} variant="contained" color="error">
            {anonymizing ? 'Erasing...' : 'Anonymize Record'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- UPLOAD REPORT DIALOG --- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Upload Lab Report</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>Select the final PDF report for <b>{selectedBooking?.patient_name}</b>.</Typography>
          <Box sx={{ mt: 2 }}><input type="file" accept="application/pdf" onChange={(e) => setReportFile(e.target.files[0])} style={{ width: '100%' }} /></Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleUploadReport} disabled={!reportFile || uploading} variant="contained" color="primary">{uploading ? 'Uploading...' : 'Confirm Upload'}</Button>
        </DialogActions>
      </Dialog>

      {/* --- ADD BOOKING DIALOG --- */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Booking</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Patient Name" value={addFormData.name} onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={addFormData.phone} onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address / Test Requirements" multiline rows={2} value={addFormData.address} onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })} /></Grid>
            <Grid item xs={12}><Typography variant="body2" color="text.secondary" gutterBottom>Upload Prescription (Optional)</Typography><input type="file" accept="image/*, application/pdf" onChange={(e) => setAddPrescription(e.target.files[0])} style={{ width: '100%', padding: '10px 0' }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddBooking} disabled={addLoading} variant="contained" color="primary">{addLoading ? 'Creating...' : 'Create Booking'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}