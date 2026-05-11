const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const rateLimit = require('express-rate-limit');

// 🛡️ SECURITY: Strict rate limiter to prevent brute-forcing tracking codes
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 searches per window
  message: { success: false, message: 'Too many search attempts. Please try again later.' }
});

// 🛡️ SECURITY: Changed from GET to POST to securely pass PII (phone number) in the request body
router.post('/', searchLimiter, async (req, res) => {
  try {
    const { code, phone } = req.body;

    if (!code || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both tracking code and registered phone number are required.' 
      });
    }

    const trackingCode = code.toUpperCase();

    // 🛡️ SECURITY: IDOR Prevention. Verify ownership by matching BOTH the secret code AND the patient's phone number
    const result = await pool.query(
      `SELECT 
         b.patient_name AS "patientName", 
         b.status, 
         t.pdf_url AS "downloadLink"
       FROM bookings b
       LEFT JOIN test_reports t ON b.id = t.booking_id
       WHERE b.short_code = $1 AND b.phone = $2 AND b.is_deleted = false`,
      [trackingCode, phone]
    );

    if (result.rows.length === 0) {
      // Generic error message to prevent data enumeration
      return res.status(404).json({ 
        success: false, 
        message: 'No active record found. Please verify your tracking code and phone number.' 
      });
    }

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error('Search API Error:', err);
    res.status(500).json({ success: false, message: 'Server error while searching for report.' });
  }
});

module.exports = router;