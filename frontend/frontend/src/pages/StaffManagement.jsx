import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Switch,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import axios from 'axios';

const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StaffManagement() {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);

  const [error, setError] = useState('');

  const [openAddModal, setOpenAddModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });

  // SNACKBAR NOTIFICATION STATE
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'info' | 'warning'
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // FETCH STAFF
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // 🛡️ SECURITY UPDATE: Check for userRole, not adminToken
        const role = localStorage.getItem('userRole');

        // Only allow admins to view this page
        if (role !== 'admin') {
          navigate('/staff-login');
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/api/staff`,
          {
            // 🛡️ SECURITY UPDATE: Send the secure httpOnly cookie natively
            withCredentials: true 
          }
        );

        if (response.data.success) {
          setStaffList(response.data.data || []);
        } else {
          setError('Unable to fetch staff records.');
        }
      } catch (err) {
        console.error('Fetch Staff Error:', err);

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          setError('Access denied. Admins only.');
        } else {
          setError(
            err.response?.data?.message ||
              'Failed to load staff records.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [navigate]);

  // TOGGLE STAFF STATUS
  const handleStatusToggle = async (
    id,
    currentStatus
  ) => {
    try {
      setToggleLoading(id);
      const newStatus = !currentStatus;

      const response = await axios.patch(
        `${BACKEND_URL}/api/staff/${id}`,
        {
          is_active: newStatus
        },
        {
          // 🛡️ SECURITY UPDATE: Send the secure httpOnly cookie natively
          withCredentials: true 
        }
      );

      if (response.data.success) {
        setStaffList(prevList =>
          prevList.map(staff =>
            staff.id === id
              ? {
                  ...staff,
                  is_active: newStatus
                }
              : staff
          )
        );
      }
    } catch (err) {
      console.error(
        'Toggle Status Error:',
        err
      );

      alert(
        err.response?.data?.message ||
          'Failed to update staff status.'
      );
    } finally {
      setToggleLoading(null);
    }
  };

  // ADD STAFF
  const handleAddStaff = async e => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${BACKEND_URL}/api/staff/add`,
        newStaff,
        {
          // 🛡️ SECURITY UPDATE: Send the secure httpOnly cookie natively
          withCredentials: true 
        }
      );

      if (response.data.success) {
        // UPDATE TABLE INSTANTLY
        setStaffList(prev => [
          ...prev,
          response.data.data
        ]);

        // CLOSE MODAL
        setOpenAddModal(false);

        // RESET FORM
        setNewStaff({
          name: '',
          email: '',
          password: '',
          role: 'staff'
        });

        // 🚀 SHOW SUCCESS MESSAGE
        setSnackbar({
          open: true,
          message: response.data.message || 'Verification email sent successfully!',
          severity: 'success'
        });

      } else {
        alert('Failed to create account.');
      }
    } catch (err) {
      console.error('Add Staff Error:', err);

      alert(
        err.response?.data?.message ||
          'Failed to add staff member.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f4f6f8',
        pb: 8
      }}
    >
      {/* NAVBAR */}
      <Box
        sx={{
          bgcolor: '#1e293b',
          color: 'white',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          boxShadow: 2
        }}
      >
        <Button
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate('/admin/dashboard')
          }
        >
          Back to Dashboard
        </Button>

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Internal Core Management
        </Typography>

        <Box sx={{ width: 140 }} />
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
          >
            Staff Directory
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() =>
              setOpenAddModal(true)
            }
          >
            Onboard New Member
          </Button>
        </Box>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* TABLE */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead
              sx={{
                bgcolor: '#f1f5f9'
              }}
            >
              <TableRow>
                <TableCell>
                  <b>Staff Name</b>
                </TableCell>

                <TableCell>
                  <b>Email Address</b>
                </TableCell>

                <TableCell>
                  <b>Assigned Role</b>
                </TableCell>

                <TableCell>
                  <b>System Access</b>
                </TableCell>

                <TableCell align="center">
                  <b>
                    Account Status Control
                  </b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No staff directories
                    found.
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map(staff => (
                  <TableRow
                    key={staff.id}
                    hover
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500
                      }}
                    >
                      {staff.name}
                    </TableCell>

                    <TableCell>
                      {staff.email}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={staff.role.toUpperCase()}
                        color={
                          staff.role ===
                          'admin'
                            ? 'secondary'
                            : 'default'
                        }
                        size="small"
                        sx={{
                          fontWeight:
                            'bold'
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          staff.is_active
                            ? 'Authorized'
                            : 'Revoked'
                        }
                        color={
                          staff.is_active
                            ? 'success'
                            : 'error'
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight:
                            'bold'
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Switch
                        checked={
                          staff.is_active
                        }
                        onChange={() =>
                          handleStatusToggle(
                            staff.id,
                            staff.is_active
                          )
                        }
                        color="success"
                        disabled={
                          toggleLoading ===
                          staff.id
                        }
                        slotProps={{
                          input: {
                            'aria-label':
                              'staff-status-toggle'
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* ADD STAFF MODAL */}
      <Dialog
        open={openAddModal}
        onClose={() =>
          setOpenAddModal(false)
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold'
          }}
        >
          Register New Staff
        </DialogTitle>

        <form
          onSubmit={handleAddStaff}
          autoComplete="off"
        >
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              label="Full Name"
              required
              fullWidth
              value={newStaff.name}
              onChange={e =>
                setNewStaff({
                  ...newStaff,
                  name: e.target.value
                })
              }
            />

            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={newStaff.email}
              onChange={e =>
                setNewStaff({
                  ...newStaff,
                  email: e.target.value
                })
              }
            />

            <TextField
              label="Default Password"
              type="password"
              required
              fullWidth
              value={newStaff.password}
              onChange={e =>
                setNewStaff({
                  ...newStaff,
                  password: e.target.value
                })
              }
            />

            <FormControl fullWidth>
              <InputLabel>
                Role
              </InputLabel>

              <Select
                value={newStaff.role}
                label="Role"
                onChange={e =>
                  setNewStaff({
                    ...newStaff,
                    role: e.target.value
                  })
                }
              >
                <MenuItem value="staff">
                  Lab Technician
                </MenuItem>

                <MenuItem value="doctor">
                  Doctor / Pathologist
                </MenuItem>

                <MenuItem value="admin">
                  System Admin
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              display: 'flex',
              gap: 2
            }}
          >
            <Button
              onClick={() =>
                setOpenAddModal(false)
              }
              color="inherit"
              fullWidth
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
            >
              {submitting
                ? 'Processing...'
                : 'Create Account'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* 🚀 THE SUCCESS POPUP NOTIFICATION */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} // Disappears after 5 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Pops up at the bottom center
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled" // Makes the colors solid and vibrant
          sx={{ width: '100%', fontWeight: 'bold' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}