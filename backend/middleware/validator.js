const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// --- AUTHENTICATION VALIDATORS ---
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isString().notEmpty().withMessage('Password required'),
  validateRequest
];

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape().withMessage('Invalid name'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters'),
  validateRequest
];

// 🛡️ NEW: Password Reset Validators
const validateForgotPassword = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  validateRequest
];

const validateResetPassword = [
  // Ensures the token is exactly a 64-character hex string (crypto.randomBytes(32).toString('hex'))
  param('token').isHexadecimal().isLength({ min: 64, max: 64 }).withMessage('Invalid token format'),
  body('newPassword').isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters'),
  validateRequest
];

// --- STAFF MANAGEMENT VALIDATORS ---
// 🛡️ NEW: Strict Enum and Type checking for Staff creation
const validateStaffAdd = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape().withMessage('Invalid name'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters'),
  body('role').isIn(['staff', 'doctor', 'admin']).withMessage('Role must be staff, doctor, or admin'),
  validateRequest
];

// 🛡️ NEW: Validate UUIDs and optional fields for Staff updates
const validateStaffUpdate = [
  param('id').isUUID().withMessage('Invalid Staff ID format'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).escape(),
  body('role').optional().isIn(['staff', 'doctor', 'admin']).withMessage('Invalid role'),
  body('is_active').optional().isBoolean().withMessage('is_active must be true or false'),
  validateRequest
];

// --- BOOKING VALIDATORS ---
const validateBooking = [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  validateRequest
];

module.exports = {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  validateStaffAdd,
  validateStaffUpdate,
  validateBooking
};