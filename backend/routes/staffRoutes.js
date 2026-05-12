const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleCheck'); // 🛡️ FIXED: Imported the RBAC middleware
const bcrypt = require('bcrypt');
const { validateStaffAdd, validateStaffUpdate } = require('../middleware/validator');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @route   GET /api/staff
 * @desc    Get a list of all staff members
 * @access  Private/Admin
 */
// 🛡️ FIXED: Used authorizeRoles to secure the route cleanly
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const queryText = 'SELECT id, name, email, role, is_active, created_at FROM staff ORDER BY name ASC';
    const result = await db.query(queryText);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff records' });
  }
});

/**
 * @route   PATCH /api/staff/:id
 * @desc    Update staff details (Profile updates & Admin overrides)
 * @access  Private (Staff can edit self, Admin can edit anyone)
 */
router.patch('/:id', protect, validateStaffUpdate, async (req, res) => {
  const targetId = req.params.id;
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;
  
  const { name, role, is_active } = req.body;

  // 🛡️ ANTI-IDOR CHECK: Verify ownership
  if (loggedInUserRole !== 'admin' && targetId !== loggedInUserId) {
    return res.status(403).json({ message: 'Forbidden: You can only modify your own profile.' });
  }

  // 🛡️ SYSTEM INTEGRITY: Prevent Admin from locking themselves out
  if (loggedInUserRole === 'admin' && targetId === loggedInUserId && is_active === false) {
    return res.status(400).json({ message: 'Action rejected: You cannot deactivate your own admin account.' });
  }

  try {
    // 🛡️ FIELD-LEVEL AUTHORIZATION: Filter what gets updated
    const finalRole = loggedInUserRole === 'admin' && role ? role : null;
    const finalIsActive = loggedInUserRole === 'admin' && is_active !== undefined ? is_active : null;

    const queryText = `
      UPDATE staff 
      SET 
        name = COALESCE($1, name), 
        role = COALESCE($2, role), 
        is_active = COALESCE($3, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, role, is_active;
    `;
    
    const result = await db.query(queryText, [name, finalRole, finalIsActive, targetId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff' });
  }
});

/**
 * @route   POST /api/staff/add
 * @desc    Admin onboarding a new staff member
 * @access  Private/Admin
 */
// 🚨 CRITICAL FIX: Added `protect` and `authorizeRoles('admin')` to prevent hackers from creating accounts!
router.post('/add', protect, authorizeRoles('admin'), async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if email already exists
    const existingUser = await db.query('SELECT * FROM staff WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already in use.' });
    }

    // 2. Hash the default password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Generate a secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 4. Insert into database
    const result = await db.query(
      `INSERT INTO staff (name, email, password_hash, role, verification_token, is_verified, is_active) 
       VALUES ($1, $2, $3, $4, $5, false, true) RETURNING id, name, email, role, is_active`,
      [name, email, hashedPassword, role, verificationToken]
    );

    const newStaff = result.rows[0];

    // 5. Construct the secure frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://reyanshdiagnostics.com';
    const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

    // 6. Send the verification email using Resend
    const message = `
      Hello ${name},

      An administrator at Reyansh Diagnostics has created an account for you.
      
      Your Role: ${role.toUpperCase()}
      Your Default Password: ${password}
      
      Please verify your email address to activate your account and log in by clicking the link below:
      ${verifyUrl}
      
      (Please change your password after logging in).
    `;

    try {
      await sendEmail({
        email: email, 
        subject: 'Welcome to Reyansh Diagnostics - Verify Your Account',
        message: message,
      });
      
      res.status(201).json({ 
        success: true, 
        message: 'Staff added and verification email sent.',
        data: newStaff
      });

    } catch (emailErr) {
      console.error('Email failed to send:', emailErr);
      res.status(201).json({ 
        success: true, 
        message: 'Staff added, but the verification email failed to send.',
        data: newStaff
      });
    }

  } catch (error) {
    console.error('Add Staff Error:', error);
    res.status(500).json({ success: false, message: 'Server error while adding staff.' });
  }
});

/**
 * @route   DELETE /api/staff/:id
 * @desc    Delete a staff member
 * @access  Private/Admin
 */
// 🛡️ FIXED: Replaced 'verifyToken' with 'protect', added proper imports above
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // 🛡️ FIXED: Changed 'pool.query' to 'db.query' to prevent server crash
    const userCheck = await db.query('SELECT * FROM staff WHERE id = $1', [id]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' });
    }

    // 🛡️ FIXED: Changed 'pool.query' to 'db.query'
    await db.query('DELETE FROM staff WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'Staff member deleted.' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Server error during deletion.' });
  }
});

module.exports = router;