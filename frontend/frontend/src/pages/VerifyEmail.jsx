import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Hit the new backend route we just created
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`);
        setStatus(res.data.message); // "Email successfully verified!"
      } catch (error) {
        setStatus(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
      {status.includes('successfully') && (
        <Link to="/staff-login" style={{ marginTop: '20px', display: 'inline-block', color: '#007bff' }}>
          Click here to Login
        </Link>
      )}
    </div>
  );
};

export default VerifyEmail;