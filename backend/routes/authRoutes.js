const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();
const { 
  validateLogin, 
  validateRegister, 
  validateForgotPassword, 
  validateResetPassword 
} = require('../middleware/validator');
const logger = require('../utils/logger');




// --- 1. SECURE REGISTRATION ---
router.post('/register', registerLimiter, validateRegister, async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Hash password with a cost factor of 12 (standard is often 10, 12 is significantly more secure)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await db.query(
      `INSERT INTO staff (email, password_hash, name, verification_token) 
       VALUES ($1, $2, $3, $4) RETURNING id, email`,
      [email, hashedPassword, name, verificationToken]
    );

    // Construct the verification URL
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const message = `Welcome to Reyansh Diagnostics! \n\nPlease verify your email by clicking the link below: \n\n ${verifyUrl}`;

    try {
      await sendEmail({
        email: email,
        subject: 'Verify Your Account',
        message: message,
      });

      res.status(201).json({ success: true, message: 'Registration successful. Please check your email to verify your account.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Registration successful, but verification email could not be sent.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

// --- 2. SECURE LOGIN (Rate Limited) ---
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  const { email, password } = req.body;

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // 1. Find the user in DB (Checking staff table)
    const result = await db.query('SELECT * FROM staff WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // 🛡️ SECURITY PATCH: Check if the account is deactivated
    if (!user.is_active) {
      logger.warn(`Failed login attempt (Account Deactivated) - Staff ID: ${user.id} - IP: ${ip}`);
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact an administrator.' });
    }

    // 🛡️ SECURITY PATCH: Check if the email is verified
    if (user.is_verified === false) { // Assuming your DB column defaults to false
      return res.status(403).json({ success: false, message: 'Please verify your email address before logging in.' });
    }

    // 2. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // On Success...
    logger.info(`Successful login - Staff ID: ${user.id} - Email: ${user.email} - IP: ${ip}`);


    // 3. Generate the JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    // 4. --- PLACE THE NEW SECURE LINES HERE ---
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // MUST be true for cross-domain cookies
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' allows cross-domain on Vercel/Render
      maxAge: 60 * 60 * 1000
    });

    // 5. Send the success response with the token
    res.json({ 
      success: true, 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, role: user.role, name: user.name } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// --- 3. PASSWORD RESET INITIATION ---
router.post('/forgot-password', validateForgotPassword, async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query('SELECT id FROM staff WHERE email = $1', [email]);
    const user = result.rows[0];

    // Always return a success message even if the email doesn't exist to prevent enumeration
    if (!user) {
      return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    // Generate token and expiry (1 hour from now)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); 

    await db.query(
      'UPDATE staff SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    // Construct the reset URL (pointing to your Vite frontend)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You requested a password reset. \n\nPlease make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: email,
        subject: 'Password Reset Request',
        message: message,
      });

      return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    } catch (err) {
      console.error(err);
      // If the email fails to send, we should clear the tokens so they can try again
      await db.query(
        'UPDATE staff SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = $1',
        [user.id]
      );
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
});

// --- 4. COMPLETE EMAIL VERIFICATION ---
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user by verification token and update status
    const result = await db.query(
      'UPDATE staff SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id',
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }

    res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed.' });
  }
});

// --- 5. COMPLETE PASSWORD RESET ---
router.post('/reset-password/:token', validateResetPassword, async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user with matching token that hasn't expired
    const result = await db.query(
      'SELECT id FROM staff WHERE reset_password_token = $1 AND reset_password_expires > CURRENT_TIMESTAMP',
      [token]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset tokens
    await db.query(
      'UPDATE staff SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ success: true, message: 'Password has been successfully reset.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed.' });
  }
});

// -----------------------------------------
// VERIFY EMAIL ROUTE
// -----------------------------------------
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Find the staff member with this token (FIXED: changed pool to db)
    const result = await db.query(
      'SELECT * FROM staff WHERE verification_token = $1',
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }

    // 2. Mark as verified and delete the token (FIXED: changed pool to db)
    await db.query(
      'UPDATE staff SET is_verified = true, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({ success: true, message: 'Email successfully verified! You can now log in.' });

  } catch (error) {
    logger.error(`Verification Error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
});

module.exports = router;