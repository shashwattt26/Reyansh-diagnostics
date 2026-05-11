import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, TextField, Button, Card, CardContent, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress // Added new imports
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Forgot Password State ---
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, 
        { email, password },
        { withCredentials: true } // 🛡️ CRITICAL: This tells the browser to save the secure cookie!
      );

      // 🛡️ SECURITY UPDATE: We no longer check for response.data.token
      if (response.data.success) {
        // Only save the non-sensitive role for UI routing purposes
        localStorage.setItem('userRole', response.data.user.role);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Handler ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    setForgotError('');
    setForgotLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: forgotEmail
      });
      
      // The backend always returns a success message to prevent email enumeration
      setForgotMessage(response.data.message);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotDialog = () => {
    setOpenForgotDialog(false);
    setForgotEmail('');
    setForgotMessage('');
    setForgotError('');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f4f6f8' }}>
      <Container maxWidth="xs">
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', color: 'white' }}>
                <LockOutlinedIcon fontSize="large" />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Staff Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Authorized personnel only.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>{error}</Alert>}

            <form onSubmit={handleLogin}>
              <TextField 
                fullWidth label="Staff Email" variant="outlined" margin="normal"
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField 
                fullWidth label="Password" variant="outlined" margin="normal"
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              
              {/* --- FORGOT PASSWORD LINK --- */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  onClick={() => setOpenForgotDialog(true)}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Button 
                type="submit" variant="contained" fullWidth size="large" 
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* --- FORGOT PASSWORD DIALOG --- */}
      <Dialog open={openForgotDialog} onClose={closeForgotDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Reset Password</DialogTitle>
        <form onSubmit={handleForgotPassword}>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your registered staff email address. If it exists in our system, we will send you a secure link to reset your password.
            </Typography>

            {forgotMessage && <Alert severity="success" sx={{ mb: 2 }}>{forgotMessage}</Alert>}
            {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}

            <TextField 
              fullWidth label="Email Address" variant="outlined" 
              type="email" required autoFocus
              value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
              disabled={forgotLoading || !!forgotMessage} 
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeForgotDialog} color="inherit">
              {forgotMessage ? 'Close' : 'Cancel'}
            </Button>
            {!forgotMessage && (
              <Button 
                type="submit" variant="contained" color="primary" 
                disabled={forgotLoading || !forgotEmail}
              >
                {forgotLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}