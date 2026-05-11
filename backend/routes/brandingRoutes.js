const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/branding
 * @desc    Fetch all branding info and highlights (Public)
 */
router.get('/', async (req, res) => {
  try {
    const settings = await db.query('SELECT key, value FROM org_settings');
    const highlights = await db.query('SELECT * FROM branding_highlights ORDER BY display_order ASC');
    
    // Transform settings array into an object for easier frontend use
    const settingsObj = settings.rows.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    res.json({
      success: true,
      settings: settingsObj,
      highlights: highlights.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branding data' });
  }
});

/**
 * @route   POST /api/branding/highlights
 * @desc    Add or update a branding highlight (Admin Only)
 */
router.post('/highlights', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

  const { title, description, icon_name, display_order } = req.body;

  try {
    const query = `
      INSERT INTO branding_highlights (title, description, icon_name, display_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await db.query(query, [title, description, icon_name, display_order]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error saving highlight' });
  }
});

module.exports = router;