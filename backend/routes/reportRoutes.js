const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const reportDir = './uploads/reports/';
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, reportDir),
  filename: (req, file, cb) => cb(null, `TEMP-REPORT-${Date.now()}${path.extname(file.originalname)}`)
});

const uploadReport = multer({ storage });

router.post('/upload/:bookingId', protect, uploadReport.single('reportPdf'), async (req, res) => {
  const { bookingId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF report.' });
  }

  try {
    // 🛡️ SECURITY: Object State Integrity Check
    // Ensure the booking exists and hasn't been anonymized/deleted before uploading anything
    const bookingCheck = await db.query('SELECT id, is_deleted FROM bookings WHERE id = $1', [bookingId]);
    
    if (bookingCheck.rowCount === 0 || bookingCheck.rows[0].is_deleted) {
      // Clean up the temporary file since we are rejecting the request
      fs.unlinkSync(req.file.path); 
      return res.status(404).json({ message: 'Booking not found or has been permanently deleted/anonymized.' });
    }

    // 1. Upload PDF to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'reyansh_reports',
      resource_type: 'raw' // 'raw' is the optimal setting for pure PDFs
    });

    const fileUrl = cloudResult.secure_url;

    // 2. Delete the temporary local file
    fs.unlinkSync(req.file.path);

    // 3. Database operations
    const reportQuery = `
      INSERT INTO test_reports (booking_id, uploaded_by, pdf_url)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    // Using req.user.id securely records exactly which staff member uploaded this
    const dbReport = await db.query(reportQuery, [bookingId, req.user.id, fileUrl]);

    await db.query("UPDATE bookings SET status = 'Report Ready' WHERE id = $1", [bookingId]);

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      report: dbReport.rows[0]
    });

  } catch (error) {
    console.error('Upload Error:', error);
    // If an error happens, attempt to clean up the temp file if it still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error saving the report' });
  }
});

module.exports = router;