// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ResetPassword() {
  const { token } = useParams(); // Extracts the token from the URL
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // 1. Basic validation
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      // 2. Send the token and new password to the backend
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password/${token}`, {
        newPassword
      });

      // 3. Show success and redirect
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate('/staff-login');
      }, 3000); // Redirect after 3 seconds

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f4f6f8' }}>
      <Container maxWidth="xs">
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', color: 'white' }}>
                <LockResetIcon fontSize="large" />
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please enter your new secure password below.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>{successMessage} Redirecting to login...</Alert>}

            {!successMessage && (
              <form onSubmit={handleSubmit}>
                <TextField 
                  fullWidth label="New Password" variant="outlined" margin="normal"
                  type="password" required
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
                <TextField 
                  fullWidth label="Confirm Password" variant="outlined" margin="normal"
                  type="password" required
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                
                <Button 
                  type="submit" variant="contained" fullWidth size="large" 
                  sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                  disabled={loading || !newPassword || !confirmPassword}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}