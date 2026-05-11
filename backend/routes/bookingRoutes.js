const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pool = require('../config/db'); 
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { validateBooking } = require('../middleware/validator');

const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

router.post('/upload-prescription', upload.single('prescription'), validateBooking, async (req, res) => {
  try {
    const { patientName, phone, address } = req.body;
    let prescriptionUrl = null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a prescription.' });
    }

    // 1. Upload the temporary file to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'reyansh_prescriptions',
      resource_type: 'auto' // Automatically handles both Images and PDFs!
    });
    
    prescriptionUrl = cloudResult.secure_url;

    // 2. Delete the temporary file from your server
    fs.unlinkSync(req.file.path);

    // 3. Save to Database
    const trackingCode = generateTrackingCode();
    const result = await pool.query(
      `INSERT INTO bookings (patient_name, phone, address, prescription_url, short_code, status) 
       VALUES ($1, $2, $3, $4, $5, 'Pending Review') RETURNING *`,
      [patientName, phone, address, prescriptionUrl, trackingCode]
    );

    const savedBooking = result.rows[0];

    // 4. Broadcast to Admin Dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('newBooking', savedBooking); 
    }

    res.json({
      success: true,
      trackingCode,
      message: 'Booking successful',
    });

  } catch (err) {
    console.error('Booking Upload Error:', err);
    res.status(500).json({ success: false, message: 'Server error during booking.' });
  }
});

module.exports = router;