const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware'); // Import the JWT gatekeeper
const authorizeRoles = require('../middleware/roleCheck'); // 🛡️ NEW: Import the role gatekeeper

/**
 * @route   GET /api/admin/bookings
 * @desc    Fetch all bookings for the lab dashboard
 * @access  Private (Admin, Receptionist, Staff, Doctor)
 */
// 🛡️ SECURITY: All staff types need to see the dashboard to do their jobs
router.get('/bookings', protect, authorizeRoles('admin', 'receptionist', 'staff', 'doctor'), async (req, res) => {
  try {
    // We order by 'created_at' DESC so newest prescriptions appear first
    const queryText = `
      SELECT 
        id, short_code, patient_name, phone, status, prescription_url, is_deleted 
      FROM bookings 
      WHERE is_deleted = false 
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(queryText);
    
    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    console.error('Admin Fetch Error:', error);
    res.status(500).json({ message: 'Error retrieving lab data' });
  }
});

/**
 * @route   PATCH /api/admin/bookings/:id/status
 * @desc    Update the lifecycle of a diagnostic test
 * @access  Private (Admin, Receptionist, Staff, Doctor)
 */
// 🛡️ SECURITY: Receptionists can update to "Scheduled/Cancelled", Techs to "Processing", Doctors to "Report Ready"
router.patch('/bookings/:id/status', protect, authorizeRoles('admin', 'receptionist', 'staff', 'doctor'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    // 🛡️ SECURITY: Prevent updating the status of deleted/anonymized records
    const queryText = `
      UPDATE bookings 
      SET status = $1 
      WHERE id = $2 AND is_deleted = false
      RETURNING id, status;
    `;
    
    const result = await db.query(queryText, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found or cannot be modified because it was anonymized.' });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

/**
 * @route   PATCH /api/admin/bookings/:id/anonymize
 * @desc    Process a patient data deletion request (Soft Delete / Anonymization)
 * @access  Private (Admin ONLY)
 */
// 🛡️ SECURITY: Strictly locked to 'admin'. Receptionists and Doctors CANNOT do this.
router.patch('/bookings/:id/anonymize', protect, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    // We overwrite PII (Personal Identifiable Information) but keep the medical status
    // and tracking code intact for backend statutory retention.
    const queryText = `
      UPDATE bookings 
      SET 
        patient_name = 'ANONYMIZED_PATIENT', 
        phone = '0000000000', 
        address = 'DATA_DELETED',
        is_deleted = true,
        deletion_requested_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING id, short_code, is_deleted;
    `;
    
    const result = await db.query(queryText, [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ success: true, message: 'Patient data successfully anonymized to comply with deletion request.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process deletion request' });
  }
});

module.exports = router;