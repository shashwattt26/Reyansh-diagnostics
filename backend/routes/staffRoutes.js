const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const { validateStaffAdd, validateStaffUpdate } = require('../middleware/validator');


/**
 * @route   GET /api/staff
 * @desc    Get a list of all staff members
 * @access  Private/Admin
 */
router.get('/', protect, async (req, res) => {
  // 🛡️ SECURITY: Only admins can view the staff directory
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

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
  // Normal staff can ONLY modify their own ID.
  if (loggedInUserRole !== 'admin' && targetId !== loggedInUserId) {
    return res.status(403).json({ message: 'Forbidden: You can only modify your own profile.' });
  }

  // 🛡️ SYSTEM INTEGRITY: Prevent Admin from locking themselves out
  if (loggedInUserRole === 'admin' && targetId === loggedInUserId && is_active === false) {
    return res.status(400).json({ message: 'Action rejected: You cannot deactivate your own admin account.' });
  }

  try {
    // 🛡️ FIELD-LEVEL AUTHORIZATION: Filter what gets updated
    // Normal staff cannot escalate their own role or reactivate themselves.
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
    
    // Notice how $2 and $3 will evaluate to null for normal staff, triggering COALESCE to keep the existing DB values.
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
router.post('/add', protect, validateStaffAdd, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  
  const { name, email, password, role } = req.body;
  
  // 🛡️ Ensure uniform high-security hashing across the entire app
  const saltRounds = 12; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const result = await db.query(
      'INSERT INTO staff (name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, name, email, role, is_active',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Email already exists or database error.' });
  }
});

module.exports = router;